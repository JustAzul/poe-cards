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

import type {SocketIoClient} from '../../hooks/useSocket';
import type {GetServerSideProps} from 'next';
import type {LeagueDetails, LeagueResult} from '../../hooks/interfaces';

interface Props {
  host: string,
  SocketIO: SocketIoClient,
  Cookies: any
}

const League = ({host, Cookies, SocketIO}: Props) => {
  const [NavbarHeight, setNavbarHeight] = useState<Number>(40);
  const [LeagueExist, setLeagueExist] = useState<Boolean>(false);
  const [ReceivedLeagueData, setReceivedLeagueData] = useState<Boolean>(false);
  
  const router = useRouter();
  const { leagueName } = router.query;

  const [LeagueDetails, setLeagueDetails] = useState<LeagueDetails>();

  const HandleListData = (League: string, LeagueResult: LeagueResult) => {
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

  const GenerateSplitsArray = (Value: number = 0) => {
    let arr = [];
    for (let i = 1; i < 10; i++) arr.push(Value * (i / 10));
    return arr;
  };

  const SplitsArray: Array<number> = GenerateSplitsArray(ExaltValue);

  const toRender = () => ( 
  <Layout parent={host} margintop={true} title={`${leagueName} League`}>  
        <Nav CurrencyValues={CurrencyValues} UpdateHeigh={setNavbarHeight} />
          <LeagueComponent
              leagueName={leagueName}
              Cookies={Cookies}
              LastUpdatedDate={LastUpdated}
              NavbarHeight={NavbarHeight} 
              CardsTable={Table ?? []} 
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

export const getServerSideProps: GetServerSideProps = async ({req}) => {

  const parseCookies = () => cookie.parse(req ? req?.headers?.cookie ?? "" : document.cookie);
  const CookieData = parseCookies();

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