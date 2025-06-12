/* eslint-disable no-nested-ternary */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */

import type {
  CurrencyValues as CurrencyValuesType,
  KeyStates,
  LeagueDetails as LeagueDetailsType,
  TableData,
} from '@/hooks/interfaces';
import { NextRouter, useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import CentralSpinner from '@/components/central-spinner';
import Contexts from '@/context';
import Dynamic from 'next/dynamic';
import type { GetServerSideProps } from 'next';
import Nav from '@/components/league/navbar';
import PageLoader from '@/components/loader';
import SortTable from '@/hooks/sortTable';
import firebase from '@/firebase/clientApp';
import { useCollection } from 'react-firebase-hooks/firestore';

const Layout = Dynamic(() => import('@/components/layout'), { loading: () => <CentralSpinner /> });

const LeagueComponent = Dynamic(() => import('@/components/league'), { loading: () => <CentralSpinner /> });
const LeagueError = Dynamic(() => import('@/pages/_error'), { loading: () => <PageLoader detail='Please Wait..' /> });

const generateSplitsArray = (Value: number = 0) => {
  const arr = [];
  for (let i = 1; i < 10; i++) arr.push(Value * (i / 10));
  return arr;
};
const GetCurrencyChaosValue = (Data = [], CurrencyName = 'Exalted Orb') => {
  const result = Data.find(({ Name }) => Name === CurrencyName);
  // @ts-expect-error im lazy, messing with types later.
  return result?.chaosEquivalent || 0;
};

interface Props {
  host: string,
}

const League = ({ host }: Props) => {
  const [navbarHeight, setNavbarHeight] = useState<number>(40);
  const [leagueExist, setLeagueExist] = useState<Boolean>(false);
  const [receivedLeagueData, setReceivedLeagueData] = useState<Boolean>(false);
  const [leagueDetails, setLeagueDetails] = useState<LeagueDetailsType>();
  const [leagueTable, setLeagueTable] = useState <Array<TableData>>([]);

  const [sortKey, setSortKey] = useState<KeyStates>('c9');
  const [sortType, setSortType] = useState<0 | 1>(1);

  const router: NextRouter = useRouter();
  const { leagueName } = router.query;

  const [leagueItems, leagueItemsLoading, leagueItemsError] = useCollection(
    // @ts-expect-error im lazy, messing with types later.
    firebase.firestore().collection('items'),
    {},
  );

  useEffect(() => {
    setReceivedLeagueData(!leagueItemsLoading && !leagueItemsError);

    if (!leagueItemsLoading && !leagueItemsError && !!leagueItems) {
      const leaguesData = leagueItems?.docs;

      const items = leaguesData.find(({ id }) => id === 'all')?.data();
      const currency = leaguesData.find(({ id }) => id === 'currency')?.data();
      const updated = leaguesData.find(({ id }) => id === 'updated')?.data();

      // @ts-expect-error im lazy, messing with types later.
      const doesLeagueExist = Object.prototype.hasOwnProperty.call(items, leagueName) && Object.prototype.hasOwnProperty.call(currency, leagueName);
      setLeagueExist(doesLeagueExist);

      if (doesLeagueExist) {
        const leagueData = {
          // @ts-expect-error im lazy, messing with types later.
          Currency: currency[leagueName],
          // @ts-expect-error im lazy, messing with types later.
          Items: items[leagueName],
          // @ts-expect-error im lazy, messing with types later.
          Updated: updated[leagueName],
        };

        const o = {
          ExaltValue: GetCurrencyChaosValue(leagueData.Currency, 'Exalted Orb') || 0,
          DivineValue: GetCurrencyChaosValue(leagueData.Currency, 'Divine Orb') || 0,
          AnullValue: GetCurrencyChaosValue(leagueData.Currency, 'Orb of Annulment') || 0,
          LastUpdated: leagueData.Updated,
          Table: leagueData.Items,
        };

        const sortedTable = SortTable(o.Table, sortKey, sortType);
        setLeagueTable(sortedTable);

        // @ts-expect-error im lazy, messing with types later.
        o.XMirrorValue = GetCurrencyChaosValue(leagueData.Currency, 'Mirror of Kalandra') || 0;
        // @ts-expect-error im lazy, messing with types later.
        o.XMirrorValue /= o.ExaltValue;
        // @ts-expect-error im lazy, messing with types later.
        o.XMirrorValue = parseFloat(o.XMirrorValue.toFixed(1));

        // @ts-expect-error im lazy, messing with types later.
        setLeagueDetails(o);
      }
    }
  }, [leagueItems, leagueItemsLoading, leagueItemsError]);

  const {
    ExaltValue, DivineValue, AnullValue, XMirrorValue, LastUpdated = 'Never',
  } = leagueDetails || {};

  const currencyValues: CurrencyValuesType = {
    Exalted: ExaltValue,
    Divine: DivineValue,
    Annul: AnullValue,
    Mirror: XMirrorValue,
  };

  const splitsArray: Array<number> = generateSplitsArray(ExaltValue);

  const contextData = {
    sortKey,
    sortType,
    setSortKey,
    setSortType,
    leagueName: leagueName?.toString() ?? 'undefined',
    lastUpdatedDate: LastUpdated,
    navbarHeight,
    cardsTable: leagueTable,
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

  return (
    <>
      {receivedLeagueData
        ? (leagueExist
          ? toRender()
          : <LeagueError statusCode={404} leagueError={true} />)
        : <PageLoader detail='Fetching Data..' />
      }
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const { headers } = req;
  const host = headers['x-forwarded-server'] || headers.host || 'poe.cards';

  return {
    props: {
      host,
    },
  };
};

export default League;
