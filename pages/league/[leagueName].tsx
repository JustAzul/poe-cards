/* eslint-disable no-nested-ternary */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */

import type {
  CurrencyValues as CurrencyValuesType,
  KeyStates,
  LeagueDetails as LeagueDetailsType,
} from '../../hooks/interfaces';
import type { GetStaticPaths, GetStaticProps } from 'next';
import type { CurrencyRateEntry } from '../../lib/mappers/league-dto-mapper';
import { useCallback, useState } from 'react';
import { useRouter } from 'next/router';

import CentralSpinner from '../../components/CentralSpinner';
import Contexts from '../../context';
import Dynamic from 'next/dynamic';
import Nav from '../../components/League/Navbar';
import PageLoader from '../../components/Loader';
import SortTable from '../../hooks/sortTable';
import mapLeagueData from '../../lib/mappers/league-dto-mapper';
import { decodeLeagueName } from '../../lib/league-name';
import useLeagueSocket from '../../hooks/useLeagueSocket';
import type { LeagueDataResponse } from '../../lib/r2-client';
import { getIndex, getLeague } from '../../lib/r2-client';

const Layout = Dynamic(() => import('../../components/Layout'), { loading: () => <CentralSpinner /> });

const LeagueComponent = Dynamic(() => import('../../components/League'), { loading: () => <CentralSpinner /> });
const LeagueError = Dynamic(() => import('../_error'), { loading: () => <PageLoader detail='Please Wait..' /> });

const DEFAULT_HOST = 'poe.cards';
const LEAGUE_REVALIDATE_SECONDS = 3600;

const generateSplitsArray = (Value: number = 0) => {
  const arr = [];
  for (let i = 1; i < 10; i++) arr.push(Value * (i / 10));
  return arr;
};
const GetCurrencyChaosValue = (Data: CurrencyRateEntry[] = [], CurrencyName = 'Exalted Orb') => {
  const result = Data.find(({ Name }) => Name === CurrencyName);
  return result?.chaosEquivalent || 0;
};

interface Props {
  host: string,
  leagueName: string,
  leagueExists: boolean,
  leagueDetails?: LeagueDetailsType,
}

const League = ({
  host, leagueName, leagueExists, leagueDetails,
}: Props) => {
  const router = useRouter();
  const [navbarHeight, setNavbarHeight] = useState<number>(40);
  const [sortKey, setSortKey] = useState<KeyStates>('c9');
  const [sortType, setSortType] = useState<0 | 1>(1);

  const refetchLeagueData = useCallback(() => {
    router.replace(router.asPath);
  }, [router]);

  useLeagueSocket(leagueName, refetchLeagueData);

  const {
    ExaltValue, DivineValue, AnullValue, XMirrorValue, LastUpdated = 'Never', Table = [],
  } = leagueDetails || {};

  const currencyValues: CurrencyValuesType = {
    Exalted: ExaltValue,
    Divine: DivineValue,
    Annul: AnullValue,
    Mirror: XMirrorValue,
  };

  const splitsArray: Array<number> = generateSplitsArray(ExaltValue);
  const sortedTable = SortTable(Table, sortKey, sortType);

  const contextData = {
    sortKey,
    sortType,
    setSortKey,
    setSortType,
    leagueName,
    lastUpdatedDate: LastUpdated,
    navbarHeight,
    cardsTable: sortedTable,
    currencyValues,
    splitsArray,
  };

  const toRender = () => (
    <Layout parent={host} margintop={true} title={`${leagueName} League`}>
      <Contexts.leaguePageData.Provider value={contextData}>
          <Nav UpdateHeigh={setNavbarHeight} />
          <LeagueComponent />
      </Contexts.leaguePageData.Provider>
    </Layout>
  );

  return leagueExists ? toRender() : <LeagueError statusCode={404} leagueError={true} />;
};

export const getStaticPaths: GetStaticPaths = async () => {
  const leagues = await getIndex();

  return {
    paths: leagues.map(({ name }) => ({ params: { leagueName: name } })),
    fallback: 'blocking',
  };
};

function buildLeagueDetails(leagueDataResponse: LeagueDataResponse): LeagueDetailsType {
  const mapped = mapLeagueData(leagueDataResponse);

  const ExaltValue = GetCurrencyChaosValue(mapped.Currency, 'Exalted Orb') || 0;
  const DivineValue = GetCurrencyChaosValue(mapped.Currency, 'Divine Orb') || 0;
  const AnullValue = GetCurrencyChaosValue(mapped.Currency, 'Orb of Annulment') || 0;

  const rawMirrorValue = GetCurrencyChaosValue(mapped.Currency, 'Mirror of Kalandra') || 0;
  const XMirrorValue = ExaltValue ? parseFloat((rawMirrorValue / ExaltValue).toFixed(1)) : 0;

  return {
    ExaltValue,
    DivineValue,
    AnullValue,
    XMirrorValue,
    LastUpdated: mapped.LastUpdated,
    Table: mapped.Table,
  };
}

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const rawLeagueName = params?.leagueName as string;
  const leagueName = decodeLeagueName(rawLeagueName);

  if (leagueName === null) {
    // eslint-disable-next-line no-console
    console.warn('league/[leagueName]: rejected — malformed percent-encoding in route param');

    return {
      props: {
        host: DEFAULT_HOST,
        leagueName: rawLeagueName,
        leagueExists: false,
      },
      revalidate: LEAGUE_REVALIDATE_SECONDS,
    };
  }

  const leagueDataResponse = await getLeague(leagueName);

  if (!leagueDataResponse) {
    return {
      props: {
        host: DEFAULT_HOST,
        leagueName,
        leagueExists: false,
      },
      revalidate: LEAGUE_REVALIDATE_SECONDS,
    };
  }

  return {
    props: {
      host: DEFAULT_HOST,
      leagueName,
      leagueExists: true,
      leagueDetails: buildLeagueDetails(leagueDataResponse),
    },
    revalidate: LEAGUE_REVALIDATE_SECONDS,
  };
};

export default League;
