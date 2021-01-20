import Layout from '../components/Layout';
import SelectLeagueTable from '../components/SelectLeagueTable';
import Spinner from '../components/Spinner';

function Home({host, LeagueDetails, isSocketConnected, SocketIO}) {

  const LeagueTableLoader = () => (
    <div className="text-center mt-5 mb-5">
      <Spinner></Spinner>
    </div>
  );
  
  return (
    <div>
    <Layout parent={host} title="Pick a League">
      {isSocketConnected === false ? <LeagueTableLoader></LeagueTableLoader>: <SelectLeagueTable LeagueDetails={LeagueDetails}></SelectLeagueTable>}
    </Layout>
    </div>  
  );
};

export async function getServerSideProps({req}) {
  
  const host = req['headers']['host'] || "localhost";
  
  let LeagueDetails = [];

  for(let i = 0; i < 4; i++) {

    const o = {
      Name: "Standard "+ i,
      EndAt: "00/00/00",
      DaysLeft: 0,
      Ladder: "#"
    };

    LeagueDetails.push(o);
  }

  return {
      props: {
        host,
          LeagueDetails
      }
  };
}

export default Home;