import Dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';
import { GetServerSideProps } from 'next/types';
import firebase from '../firebase/clientApp';
import CentralSpinner from '../components/CentralSpinner';

import Layout from '../components/Layout';

const SelectLeagueTable = Dynamic(() => import('../components/Table'), { loading: () => <CentralSpinner /> });

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
    firebase.firestore().collection('leagues'),
    {},
  );

  useEffect(() => {
    if (!leaguesLoading && !leaguesError && leagues) {
      const leaguesData = leagues?.docs
        .find(({ id }) => id === 'all');

      // @ts-expect-error im lazy, messing with types later.
      setLeagueDetails(parseLeaguesData(leaguesData?.data()));
    } else setLeagueDetails(defaultLeagueData);
  }, [leaguesLoading, leaguesError, leagues]);

  return (
    <Layout parent={host} title="Pick a League">
      <SelectLeagueTable LeagueDetails={LeagueDetails} />
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const Headers = req.headers;
  const host = Headers['x-forwarded-server'] ?? Headers.host ?? 'poe.cards';

  const data = await firebase.firestore().collection('leagues').get();
  const doc = data.docs.find(({ id }) => id === 'all');
  // @ts-expect-error im lazy and will fix types later
  const defaultLeagueData = Object.values(doc?.data()) || [];

  return {
    props: {
      host,
      defaultLeagueData,
    },
  };
};

export default Home;
