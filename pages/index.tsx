import { useEffect, useState } from 'react';

import CentralSpinner from '../components/CentralSpinner';
import Contexts from '../context';
import Dynamic from 'next/dynamic';
import { GetServerSideProps } from 'next/types';
import Layout from '../components/Layout';
import firebaseAdmin from '../firebase/adminApp';
import firebaseClient from '../firebase/clientApp';
import { useCollection } from 'react-firebase-hooks/firestore';

const SelectLeagueTable = Dynamic(
  () => import('../components/Table'),
  { loading: () => <CentralSpinner /> },
);

interface Props {
  host: string,
  defaultLeagueData: any
}

function parseLeaguesData(Leagues = []) {
  return Object.values(Leagues);
}

function Home({ host, defaultLeagueData }: Props) {
  const [LeagueDetails, setLeagueDetails] = useState(defaultLeagueData);

  const [leagues, leaguesLoading, leaguesError] = useCollection(
    // @ts-expect-error im lazy, messing with types later.
    firebaseClient.firestore().collection('leagues'),
    {},
  );

  useEffect(() => {
    if (!leaguesLoading && !leaguesError && leagues) {
      const leaguesData = leagues?.docs
        .find(({ id }) => id === 'all');

      setLeagueDetails(
        parseLeaguesData(
          // @ts-expect-error im lazy, messing with types later.
          leaguesData?.data(),
        ),
      );
    } else setLeagueDetails(defaultLeagueData);
  }, [leaguesLoading, leaguesError, leagues]);

  return (
    <Layout parent={host} title="Pick a League">
      <Contexts.leagueDetails.Provider value={LeagueDetails}>
        <SelectLeagueTable />
      </Contexts.leagueDetails.Provider>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const Headers = req.headers;
  const host = Headers['x-forwarded-server'] ?? Headers.host ?? 'poe.cards';

  const defaultLeagueData = (await firebaseAdmin
    .firestore()
    .collection('leagues')
    .doc('all')
    .get())
    .data();

  return {
    props: {
      host,
      // @ts-expect-error we are receiving correct data here.
      defaultLeagueData: parseLeaguesData(defaultLeagueData),
    },
  };
};

export default Home;
