/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import useSWR from 'swr';
import Dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import CentralSpinner from '../components/CentralSpinner';

import Layout from '../components/Layout';

import { Leagues } from '../hooks/interfaces';

const moment = require('moment');

const fetcher = (url) => fetch(url).then((r) => r.json());

const SelectLeagueTable = Dynamic(() => import('../components/Table'), { loading: () => <CentralSpinner /> });

interface Props {
  host: string,
}

function calculateDaysDiff(InitialDate, EndDate) {
  if (!InitialDate || !EndDate) return 9999;
  return moment(EndDate).diff(InitialDate, 'days');
}

function FilterLeagues(Leagues = []) {
  const Result = Leagues
    .filter(({ realm }) => realm === 'pc')
    .filter(({ id }) => id.indexOf('SSF') === -1)
    .filter(({ id }) => id !== 'Hardcore')
    .filter(({ id }) => id !== 'Standard');

  return Result;
}

function parseLeaguesData(Leagues = []) {
  return Leagues
    .map((League) => {
      const DaysDiff = calculateDaysDiff(League.startAt, League.endAt);

      const o = {
        leagueName: League.id,
        startAt: League.startAt,
        endAt: League.endAt,
        ladder: League.url,
        DaysLeft: DaysDiff,
      };

      return o;
    });
}

function Home({ host }: Props) {
  const [LeagueDetails, setLeagueDetails] = useState<Array<Leagues>>([]);

  const { data, error } = useSWR('https://api.pathofexile.com/leagues', fetcher);

  useEffect(() => {
    if (data && !error) {
      const LeagueList = FilterLeagues(data);
      const LeaguesData = parseLeaguesData(LeagueList);
      setLeagueDetails(LeaguesData);
    }
  }, [data, error]);

  return (
    <Layout parent={host} title="Pick a League">
      <SelectLeagueTable LeagueDetails={LeagueDetails} />
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const Headers = req.headers;
  const host = Headers['x-forwarded-server'] ?? Headers.host ?? 'poe.cards';

  return {
    props: {
      host,
    },
  };
};

export default Home;
