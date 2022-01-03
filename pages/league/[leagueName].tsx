/* eslint-disable no-nested-ternary */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import { NextRouter, useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';
import cookie from 'cookie';

import Dynamic from 'next/dynamic';

import type { GetServerSideProps } from 'next';
import firebase from '../../firebase/clientApp';
import CentralSpinner from '../../components/CentralSpinner';
import PageLoader from '../../components/Loader';
import Nav from '../../components/League/Navbar';

import type {
  LeagueDetails as LeagueDetailsType,
  CurrencyValues as CurrencyValuesType,
  TableData,
  KeyStates,
} from '../../hooks/interfaces';

const Layout = Dynamic(() => import('../../components/Layout'), { loading: () => <CentralSpinner /> });

const LeagueComponent = Dynamic(() => import('../../components/League'), { loading: () => <CentralSpinner /> });
const LeagueError = Dynamic(() => import('../_error'), { loading: () => <PageLoader detail='Please Wait..' /> });

interface Props {
  host: string,
  Cookies: any
}

const InternalEnum = {
  c5: 'setchaosprice',
  c6: 'setexprice',
  c9: 'chaosprofit',
  c10: 'exprofit',
};

const SortTable = (Table: Array<TableData> = [], SortKey: KeyStates = 'c9', SortType: 0|1 = 1): Array<TableData> => Table.sort((a, b) => {
  // @ts-expect-error im lazy, messing with types later.
  const SortVar = InternalEnum[SortKey];

  // @ts-expect-error im lazy, messing with types later.
  const v1 = a[SortVar];
  // @ts-expect-error im lazy, messing with types later.
  const v2 = b[SortVar];

  if (SortType) return v2 - v1;
  return v1 - v2;
});

const League = ({ host, Cookies }: Props) => {
  const [NavbarHeight, setNavbarHeight] = useState<number>(40);
  const [LeagueExist, setLeagueExist] = useState<Boolean>(false);
  const [ReceivedLeagueData, setReceivedLeagueData] = useState<Boolean>(false);
  const [LeagueDetails, setLeagueDetails] = useState<LeagueDetailsType>();
  const [LeagueTable, setLeagueTable] = useState <Array<TableData>>([]);

  const [SortKey, setSortKey] = useState<KeyStates>('c9');
  const [SortType, setSortType] = useState<0 | 1>(1);

  const router: NextRouter = useRouter();
  const { leagueName } = router.query;

  const [leagueItems, leagueItemsLoading, leagueItemsError] = useCollection(
    // @ts-expect-error im lazy, messing with types later.
    firebase.firestore().collection('items'),
    {},
  );

  const GetCurrencyChaosValue = (Data = [], CurrencyName = 'Exalted Orb') => {
    const Result = Data.find(({ Name }) => Name === CurrencyName);
    // @ts-expect-error im lazy, messing with types later.
    return Result?.chaosEquivalent || 0;
  };

  useEffect(() => {
    setReceivedLeagueData(!leagueItemsLoading && !leagueItemsError);

    if (!leagueItemsLoading && !leagueItemsError && !!leagueItems) {
      const leaguesData = leagueItems?.docs;

      const Items = leaguesData.find(({ id }) => id === 'all')?.data();
      const Currency = leaguesData.find(({ id }) => id === 'currency')?.data();
      const Updated = leaguesData.find(({ id }) => id === 'updated')?.data();

      // @ts-expect-error im lazy, messing with types later.
      const DoesLeagueExist = Object.prototype.hasOwnProperty.call(Items, leagueName) && Object.prototype.hasOwnProperty.call(Currency, leagueName);
      setLeagueExist(DoesLeagueExist);

      if (DoesLeagueExist) {
        const LeagueData = {
          // @ts-expect-error im lazy, messing with types later.
          Currency: Currency[leagueName],
          // @ts-expect-error im lazy, messing with types later.
          Items: Items[leagueName],
          // @ts-expect-error im lazy, messing with types later.
          Updated: Updated[leagueName],
        };

        // console.log(LeagueData);

        const o = {
          ExaltValue: GetCurrencyChaosValue(LeagueData.Currency, 'Exalted Orb') || 0,
          DivineValue: GetCurrencyChaosValue(LeagueData.Currency, 'Divine Orb') || 0,
          AnullValue: GetCurrencyChaosValue(LeagueData.Currency, 'Orb of Annulment') || 0,
          LastUpdated: LeagueData.Updated,
          Table: LeagueData.Items,
        };

        setLeagueTable(o.Table);

        // @ts-expect-error im lazy, messing with types later.
        o.XMirrorValue = GetCurrencyChaosValue(LeagueData.Currency, 'Mirror of Kalandra') || 0;
        // @ts-expect-error im lazy, messing with types later.
        o.XMirrorValue /= o.ExaltValue;
        // @ts-expect-error im lazy, messing with types later.
        o.XMirrorValue = parseFloat(o.XMirrorValue.toFixed(1));

        // @ts-expect-error im lazy, messing with types later.
        setLeagueDetails(o);
      }
    }
  }, [leagueItems, leagueItemsLoading, leagueItemsError]);

  useEffect(() => {
    if (LeagueTable.length > 1) {
      const SortedTable = SortTable(LeagueTable, SortKey, SortType);
      setLeagueTable(SortedTable);
    }
  }, [LeagueTable, SortKey, SortType]);

  const {
    ExaltValue, DivineValue, AnullValue, XMirrorValue, LastUpdated = 'Never', /* Table, */
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
              SortKey={SortKey}
              SortType={SortType}
              setSortKey={setSortKey}
              setSortType={setSortType}
              leagueName={leagueName?.toString() ?? 'undefined'}
              Cookies={Cookies}
              LastUpdatedDate={LastUpdated}
              NavbarHeight={NavbarHeight}
              CardsTable={LeagueTable}
              CurrencyValues={CurrencyValues}
              SplitsArray={SplitsArray}
              />
    </Layout>
  );

  return (
    <>
      {ReceivedLeagueData
        ? (LeagueExist
          ? toRender()
          : <LeagueError statusCode={404} leagueError={true} />)
        : <PageLoader detail='Fetching Data..' />
      }
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  // eslint-disable-next-line no-undef
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
