import Layout from '../components/Layout';
import SelectLeagueTable from '../components/SelectLeagueTable';
//import Footer from '../components/Footer';

function Home({parent, LeagueDetails, ttv}) {
  return (
    <div>
    <Layout ttv={ttv} parent={parent} title="Pick a League">
      <SelectLeagueTable LeagueDetails={LeagueDetails}></SelectLeagueTable>
    </Layout>
    </div>  
  );
};

export async function getServerSideProps() {

  const parent = "localhost";
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
          parent,
          LeagueDetails
      }
  };
}

export default Home;