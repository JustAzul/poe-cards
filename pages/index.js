import Layout from '../components/Layout';
import SelectLeagueTable from '../components/SelectLeagueTable';
//import Footer from '../components/Footer';

function Home({parent, LeagueDetails}) {
  return (
    <div>
    <Layout parent={parent} title="Pick a League">
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
      EndAt: "December 7, 2025",
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