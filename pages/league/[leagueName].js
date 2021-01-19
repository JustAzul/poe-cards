import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import Nav from '../../components/League/Navbar';
import LeagueC from '../../components/League';

const League = ({SplitsArray}) => {
  const router = useRouter();
  const { leagueName } = router.query;

  return ( <>
       
        <Layout margintop={true} parent="localhost" title={`${leagueName} League`}>            
            <Nav></Nav>
            <LeagueC SplitsArray={SplitsArray}></LeagueC>
        </Layout>

      </>
  );
}

export async function getServerSideProps() {
  const GenerateSplitsArray = async (Value = 100) => {
    let arr = [];
    for (let i = 1; i < 10; i++) arr.push(Value * (i / 10));
    return arr;
  };

  const SplitsArray = await GenerateSplitsArray(80);

  return {
    props: {
      SplitsArray
    }
  }
}

export default League;