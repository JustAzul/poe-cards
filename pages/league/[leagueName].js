import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import cookie from "cookie";

import Dynamic from 'next/dynamic';

import CentralSpinner from '../../components/CentralSpinner';
import PageLoader from '../../components/Loader';

const Layout = Dynamic(() => import('../../components/Layout'), {loading: () => <CentralSpinner />});
import Nav from '../../components/League/Navbar';

const LeagueComponent = Dynamic(() => import('../../components/League'), {loading: () => <CentralSpinner />});
const LeagueError = Dynamic(() => import('../_error'), {loading: () => <PageLoader />});

const League = ({host, Cookies, SocketIO}) => {
  const [NavbarHeight, setNavbarHeight] = useState(40);
  const [LeagueExist, setLeagueExist] = useState(false);
  const [ReceivedLeagueData, setReceivedLeagueData] = useState(false);
  
  const router = useRouter();
  const { leagueName } = router.query;

  const [LeagueDetails, setLeagueDetails] = useState({});

  const HandleListData = (League, LeagueResult) => {
    if(League === leagueName) {
      const { success, details } = LeagueResult;
      setLeagueDetails(details);
      setLeagueExist(success);
      setReceivedLeagueData(true);
    }
  };

  useEffect(() => {
    if (SocketIO) {
      SocketIO.emit("getLeagueDetails", leagueName);
      SocketIO.on("LeagueDetails", HandleListData);      
    }

    return () => {
      try {
        SocketIO.off("LeagueDetails", HandleListData);
      } catch (err) {}
    };

  }, [SocketIO]);

  const {ExaltValue, DivineValue, AnullValue, XMirrorValue, LastUpdated, Table} = LeagueDetails || {};
  
  const CurrencyValues = {
    'Exalted': ExaltValue,
    'Divine': DivineValue,
    'Annul': AnullValue,
    'Mirror': XMirrorValue
  };

  const GenerateSplitsArray = Value => {
    let arr = [];
    for (let i = 1; i < 10; i++) arr.push(Value * (i / 10));
    return arr;
  };

  const SplitsArray = GenerateSplitsArray(ExaltValue);

  const toRender = () => ( 
  <Layout parent={host} margintop={true} title={`${leagueName} League`}>  
        <Nav CurrencyValues={CurrencyValues} UpdateHeigh={setNavbarHeight} />
          <LeagueComponent
              leagueName={leagueName}
              Cookies={Cookies}
              LastUpdatedDate={LastUpdated}
              NavbarHeight={NavbarHeight} 
              CardsTable={Table || []} 
              CurrencyValues={CurrencyValues}
              SplitsArray={SplitsArray} 
              />
    </Layout>
  );

  return (
    <>
      {ReceivedLeagueData ? (LeagueExist ? toRender() : <LeagueError statusCode={404} leagueError={true} />) : <PageLoader />}
    </>
  );
}

export async function getServerSideProps({req}) {

  const parseCookies = req => cookie.parse(req ? req.headers.cookie || "" : document.cookie);
  const CookieData = parseCookies(req);

  const headers = req['headers'];
  const host = headers['x-forwarded-server'] || headers['host'] || "https://justazul.xyz";

  return {
    props: {
      host,
      Cookies: CookieData && CookieData
    }
  }
}

export default League;