import { useRouter } from 'next/router';
import { useState } from 'react';
import Layout from '../../components/Layout';
import Nav from '../../components/League/Navbar';
import LeagueComponent from '../../components/League';

const League = ({SplitsArray}) => {
  const router = useRouter();
  const { leagueName } = router.query;

  const [NavbarHeight, setNavbarHeight] = useState(40);

  const CardsArray = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];

  return ( 
    <>
      <Layout margintop={true} parent="localhost" title={`${leagueName} League`}>            
          <Nav UpdateHeigh={setNavbarHeight}></Nav>
          <LeagueComponent NavbarHeight={NavbarHeight} CardsArray={CardsArray} SplitsArray={SplitsArray}></LeagueComponent>
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