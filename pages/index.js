import Layout from '../components/Layout';
import Dynamic from 'next/dynamic';
import Spinner from '../components/Spinner';
import {useEffect, useState} from 'react';

const LeagueTableLoader = () => (
  <div className="mt-5 mb-5">
    <Spinner/>
  </div>
);

const SelectLeagueTable = Dynamic(() => import('../components/Table'), {loading: () => LeagueTableLoader()});

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
      {Object.values(LeagueDetails).length === 0 ? <LeagueTableLoader /> : <SelectLeagueTable LeagueDetails={LeagueDetails} />}
    </Layout>
  );
};

export async function getServerSideProps({req}) {

  const headers = req['headers'];
  const host = headers['x-forwarded-server'] || headers['host'] || "poe.cards";

  return {
      props: {
        host
      }
  };
}

export default Home;