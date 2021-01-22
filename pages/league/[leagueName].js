import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import cookie from "cookie";

import Layout from '../../components/Layout';
import Nav from '../../components/League/Navbar';

import LeagueComponent from '../../components/League';
import LoaderComponent from '../../components/Loader';

const League = ({host, Cookies, isSocketConnected, SocketIO}) => {
  const [NavbarHeight, setNavbarHeight] = useState(40);
  
  const router = useRouter();
  const { leagueName } = router.query;

  const [LeagueDetails, setLeagueDetails] = useState({});

  const HandleListData = (League, LeagueResult) => {
    if(League === leagueName) setLeagueDetails(LeagueResult);
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

  const {ExaltValue, DivineValue, AnullValue, XMirrorValue, LastUpdated, Table} = LeagueDetails['details'] || {};
  
  const CurrencyValues = {
    'Exalted': ExaltValue,
    'Divine': DivineValue,
    'Annul': AnullValue,
    'Mirror': XMirrorValue
  };

  const GenerateSplitsArray = (Value = 100) => {
    let arr = [];
    for (let i = 1; i < 10; i++) arr.push(Value * (i / 10));
    return arr;
  };

  const SplitsArray = GenerateSplitsArray(ExaltValue);

  const Page = () => ( 
  <Layout parent={host} margintop={true} title={`${leagueName} League`}>  
        <Nav 
            CurrencyValues={CurrencyValues} 
            UpdateHeigh={setNavbarHeight}>
        </Nav>

          <LeagueComponent
              leagueName={leagueName}
              Cookies={Cookies}
              LastUpdated={LastUpdated}
              NavbarHeight={NavbarHeight} 
              CardsTable={Table || []} 
              CurrencyValues={CurrencyValues}
              SplitsArray={SplitsArray} 
              />
    </Layout>
  );

  return (
    <>
      {isSocketConnected ? Page() : <LoaderComponent />}
    </>
  );
}

export async function getServerSideProps({req}) {

  const parseCookies = req => cookie.parse(req ? req.headers.cookie || "" : document.cookie);
  const CookieData = parseCookies(req);

  const headers = req['headers'];
  const host = headers['x-forwarded-server'] || headers['host'] || "poe.cards";

  return {
    props: {
      host,
      Cookies: CookieData && CookieData
    }
  }
}

export default League;