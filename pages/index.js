import Layout from '../components/Layout';
import SelectLeagueTable from '../components/SelectLeagueTable';
import Spinner from '../components/Spinner';
import {useEffect, useState} from 'react';

function Home({host, isSocketConnected, SocketIO}) {
  const [LeagueDetails, setLeagueDetails] = useState({});

  const HandleListData = data => {
    setLeagueDetails(data);
  };

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

  const LeagueTableLoader = () => (
    <div className="text-center mt-5 mb-5">
      <Spinner></Spinner>
    </div>
  );
  
  return (
    <div>
    <Layout parent={host} title="Pick a League">
      {(isSocketConnected === false) ? <LeagueTableLoader></LeagueTableLoader>: Object.values(LeagueDetails).length === 0 ? <LeagueTableLoader></LeagueTableLoader> : <SelectLeagueTable LeagueDetails={LeagueDetails}></SelectLeagueTable>}
    </Layout>
    </div>  
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