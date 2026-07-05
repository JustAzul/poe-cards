/* eslint-disable no-nested-ternary */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */

import type {
  CurrencyValues as CurrencyValuesType,
  KeyStates,
  LeagueDetails as LeagueDetailsType,
} from '../../hooks/interfaces';
import type { GetStaticPaths, GetStaticProps } from 'next';
import {
  useCallback, useEffect, useRef, useState,
} from 'react';

import CentralSpinner from '../../components/CentralSpinner';
import Contexts from '../../context';
import Dynamic from 'next/dynamic';
import Nav from '../../components/League/Navbar';
import PageLoader from '../../components/Loader';
import SortTable from '../../hooks/sortTable';
import { buildLeagueDetails } from '../../lib/mappers/league-dto-mapper';
import useLeagueSocket from '../../hooks/useLeagueSocket';
import { getIndex, getLeague } from '../../lib/r2-client';

type LiveLeagueData =
  | { leagueExists: true, leagueDetails: LeagueDetailsType }
  | { leagueExists: false, leagueDetails?: undefined };

function isLeagueDetailsShape(value: unknown): value is LeagueDetailsType {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Partial<LeagueDetailsType>;
  return (
    typeof candidate.ExaltValue === 'number'
    && typeof candidate.DivineValue === 'number'
    && typeof candidate.AnullValue === 'number'
    && typeof candidate.XMirrorValue === 'number'
    && typeof candidate.LastUpdated === 'string'
    && Array.isArray(candidate.Table)
  );
}

function isLiveLeagueData(value: unknown): value is LiveLeagueData {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as { leagueExists?: unknown, leagueDetails?: unknown };

  if (candidate.leagueExists === true) return isLeagueDetailsShape(candidate.leagueDetails);
  return candidate.leagueExists === false;
}

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

interface Props {
  host: string,
  leagueName: string,
  leagueExists: boolean,
  leagueDetails?: LeagueDetailsType,
}

const League = ({
  host, leagueName, leagueExists: initialLeagueExists, leagueDetails: initialLeagueDetails,
}: Props) => {
  const [navbarHeight, setNavbarHeight] = useState<number>(40);
  const [sortKey, setSortKey] = useState<KeyStates>('c9');
  const [sortType, setSortType] = useState<0 | 1>(1);
  const [leagueExists, setLeagueExists] = useState<boolean>(initialLeagueExists);
  const [leagueDetails, setLeagueDetails] = useState<LeagueDetailsType | undefined>(initialLeagueDetails);

  // useLeagueSocket fires a refetch both on WS connect/reconnect and on each
  // "updated" message — two calls can be in flight at once, and network timing
  // gives no guarantee the one fired first resolves first. This ref lets a
  // resolving fetch check "is a newer request still in flight?" before applying
  // its result, so an older response can never clobber a newer one.
  const latestRequestIdRef = useRef(0);

  // Next's pages-router reuses this component instance across client-side
  // navigations between two different league pages (no remount). Bumping the
  // request id here (not just resetting state) also invalidates any refetch
  // still in flight for the PREVIOUS league — otherwise a slow response for
  // League A could resolve after navigating to League B and overwrite its
  // freshly-set props with League A's data.
  useEffect(() => {
    latestRequestIdRef.current += 1;
    setLeagueExists(initialLeagueExists);
    setLeagueDetails(initialLeagueDetails);
  }, [leagueName, initialLeagueExists, initialLeagueDetails]);

  const refetchLeagueData = useCallback(async () => {
    const requestId = latestRequestIdRef.current + 1;
    latestRequestIdRef.current = requestId;

    try {
      const response = await fetch(`/api/league-data?leagueName=${encodeURIComponent(leagueName)}`);
      if (!response.ok) {
        // eslint-disable-next-line no-console
        console.warn(`League: live refetch failed with status ${response.status}`);
        return;
      }

      const data: unknown = await response.json();
      if (!isLiveLeagueData(data)) {
        // eslint-disable-next-line no-console
        console.warn('League: live refetch returned an unexpected shape, ignoring');
        return;
      }

      if (latestRequestIdRef.current !== requestId) {
        // A newer refetch was triggered while this one was in flight — its
        // result (once it resolves) is the one that should win, not this one.
        return;
      }

      setLeagueExists(data.leagueExists);
      setLeagueDetails(data.leagueDetails);
    } catch (error: unknown) {
      const reason = error instanceof Error ? error.message : String(error);
      // eslint-disable-next-line no-console
      console.warn(`League: live refetch threw (${reason})`);
    }
  }, [leagueName]);

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

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  // Next's route matcher already URL-decodes dynamic route params before
  // getStaticProps runs — this is a trusted internal boundary, not raw/
  // external input, so no decode step belongs here. Decoding again would
  // double-decode any league name that legitimately contains a literal `%`
  // (e.g. "100% Delirium"), throwing on `"% D"` as a bogus escape sequence.
  const leagueName = params?.leagueName as string;
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
