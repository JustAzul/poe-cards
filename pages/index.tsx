import type { GetStaticProps } from 'next';
import type { IndexEntry } from '../lib/r2-client';
import type { Leagues } from '../hooks/interfaces';

import CentralSpinner from '../components/CentralSpinner';
import Contexts from '../context';
import Dynamic from 'next/dynamic';
import Layout from '../components/Layout';
import { getIndex } from '../lib/r2-client';

const SelectLeagueTable = Dynamic(
  () => import('../components/Table'),
  { loading: () => <CentralSpinner /> },
);

const DEFAULT_HOST = 'poe.cards';
const INDEX_REVALIDATE_SECONDS = 3600;

interface Props {
  host: string,
  leagueDetails: Leagues[],
}

function mapIndexToLeagues(entries: IndexEntry[]): Leagues[] {
  return entries.map(({ name, ladder }) => ({ leagueName: name, ladder }));
}

function Home({ host, leagueDetails }: Props) {
  return (
    <Layout parent={host} title="Pick a League">
      <Contexts.leagueDetails.Provider value={leagueDetails}>
        <SelectLeagueTable />
      </Contexts.leagueDetails.Provider>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const index = await getIndex();

  return {
    props: {
      host: DEFAULT_HOST,
      leagueDetails: mapIndexToLeagues(index),
    },
    revalidate: INDEX_REVALIDATE_SECONDS,
  };
};

export default Home;
