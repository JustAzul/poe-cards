import Dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';
import firebase from '../firebase/clientApp';
import CentralSpinner from '../components/CentralSpinner';

import Layout from '../components/Layout';

const SelectLeagueTable = Dynamic(() => import('../components/Table'), { loading: () => <CentralSpinner /> });

interface Props {
  host: string,
}

function parseLeaguesData(Leagues = []) {
  return Object.values(Leagues);
}

function Home({ host }: Props) {
  const [LeagueDetails, setLeagueDetails] = useState([]);

  const [leagues, leaguesLoading, leaguesError] = useCollection(
    firebase.firestore().collection('leagues'),
    {},
  );

  useEffect(() => {
    if (!leaguesLoading && !leaguesError && leagues) {
      const leaguesData = leagues?.docs
        .find((doc) => doc.id === 'all');

      setLeagueDetails(parseLeaguesData(leaguesData?.data()));
    } else setLeagueDetails([]);
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

  return {
    props: {
      host,
    },
  };
};

export default Home;
