/* eslint-disable no-nested-ternary */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import { NextRouter, useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import cookie from 'cookie';

import Dynamic from 'next/dynamic';

import type { GetServerSideProps } from 'next';
import CentralSpinner from '../../components/CentralSpinner';
import PageLoader from '../../components/Loader';
import Nav from '../../components/League/Navbar';

import type { SocketIoClient } from '../../hooks/useSocket';
import type { LeagueDetails as LeagueDetailsType, LeagueResult as LeagueResultType, CurrencyValues as CurrencyValuesType } from '../../hooks/interfaces';

const Layout = Dynamic(() => import('../../components/Layout'), { loading: () => <CentralSpinner /> });

const LeagueComponent = Dynamic(() => import('../../components/League'), { loading: () => <CentralSpinner /> });
const LeagueError = Dynamic(() => import('../_error'), { loading: () => <PageLoader /> });

interface Props {
  host: string,
  SocketIO: SocketIoClient,
  Cookies: any
}

const League = ({ host, Cookies, SocketIO }: Props) => {
  const [NavbarHeight, setNavbarHeight] = useState<number>(40);
  const [LeagueExist, setLeagueExist] = useState<Boolean>(false);
  const [ReceivedLeagueData, setReceivedLeagueData] = useState<Boolean>(false);

  const router: NextRouter = useRouter();
  const { leagueName } = router.query;

  const [LeagueDetails, setLeagueDetails] = useState<LeagueDetailsType>();

  const HandleListData = (LeagueName: string, LeagueResult: LeagueResultType) => {
    if (LeagueName === leagueName) {
      const { success, details } = LeagueResult;
      setLeagueDetails(details);
      setLeagueExist(success);
      setReceivedLeagueData(true);
    }
  };

  useEffect(() => {
    if (SocketIO) {
      SocketIO.emit('getLeagueDetails', leagueName);
      SocketIO.on('LeagueDetails', HandleListData);
    }

    return () => {
      try {
        SocketIO.off('LeagueDetails', HandleListData);
      } catch (err) {}
    };
  }, [SocketIO]);

  const {
    ExaltValue, DivineValue, AnullValue, XMirrorValue, LastUpdated = 'Never', Table,
  } = LeagueDetails || {};

  const CurrencyValues: CurrencyValuesType = {
    Exalted: ExaltValue,
    Divine: DivineValue,
    Annul: AnullValue,
    Mirror: XMirrorValue,
  };

  const GenerateSplitsArray = (Value: number = 0) => {
    const arr = [];
    for (let i = 1; i < 10; i++) arr.push(Value * (i / 10));
    return arr;
  };

  const SplitsArray: Array<number> = GenerateSplitsArray(ExaltValue);

  const toRender = () => (
  <Layout parent={host} margintop={true} title={`${leagueName} League`}>
        <Nav CurrencyValues={CurrencyValues} UpdateHeigh={setNavbarHeight} />
          <LeagueComponent
              leagueName={leagueName?.toString() ?? 'undefined'}
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
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const parseCookies = () => cookie.parse(req ? req?.headers?.cookie ?? '' : document.cookie);
  const CookieData = parseCookies();

  const { headers } = req;
  const host = headers['x-forwarded-server'] || headers.host || 'poe.cards';

  return {
    props: {
      host,
      Cookies: CookieData && CookieData,
    },
  };
};

export default League;
