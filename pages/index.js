import Dynamic from 'next/dynamic';
import CentralSpinner from '../components/CentralSpinner';

const Layout = Dynamic(() => import('../components/Layout'), {loading: () => <CentralSpinner />});
const SelectLeagueTable = Dynamic(() => import('../components/Table'), {loading: () => <CentralSpinner />});

import {useEffect, useState} from 'react';

function Home({host, SocketIO}) {
  const [LeagueDetails, setLeagueDetails] = useState({});

  const HandleListData = data => setLeagueDetails(data);

  useEffect(() => {
    if (SocketIO) {
      SocketIO.emit("getLeagueList");
      SocketIO.on("LeagueListData", HandleListData);
    }

    return () => {
      try {
        SocketIO.off("LeagueListData", HandleListData);
      } catch (err) {}
    };

  }, [SocketIO]);
  
  return (
    <Layout parent={host} title="Pick a League">
      {Object.values(LeagueDetails).length === 0 ? <CentralSpinner /> : <SelectLeagueTable LeagueDetails={LeagueDetails} />}
    </Layout>
  );
};

export async function getServerSideProps({req}) {

  const headers = req['headers'];
  const host = headers['x-forwarded-server'] || headers['host'] || "https://justazul.xyz";

  return {
      props: {
        host
      }
  };
}

export default Home;