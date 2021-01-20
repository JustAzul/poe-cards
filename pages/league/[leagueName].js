import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import cookie from "cookie";

import Layout from '../../components/Layout';
import Nav from '../../components/League/Navbar';
import LeagueComponent from '../../components/League';

const League = ({Cookies, SplitsArray, CardsArray, CurrencyValues}) => {
  const [NavbarHeight, setNavbarHeight] = useState(40);
  
  const router = useRouter();
  const { leagueName } = router.query;

  useEffect(()=> {
    
  });
  
  return ( 
    <>
      <Layout margintop={true} parent="localhost" title={`${leagueName} League`}>            
        
        <Nav 
            CurrencyValues={CurrencyValues} 
            UpdateHeigh={setNavbarHeight}>
        </Nav>

          <LeagueComponent
              leagueName={leagueName}
              Cookies={Cookies}
              NavbarHeight={NavbarHeight} 
              CardsArray={CardsArray} 
              CurrencyValues={CurrencyValues}
              SplitsArray={SplitsArray}>
          </LeagueComponent>

      </Layout>
    </>
  );
}

export async function getServerSideProps({req}) {

  const parseCookies = req => cookie.parse(req ? req.headers.cookie || "" : document.cookie);
  const CookieData = parseCookies(req);
  
  const GenerateSplitsArray = async (Value = 100) => {
    let arr = [];
    for (let i = 1; i < 10; i++) arr.push(Value * (i / 10));
    return arr;
  };
  
  const CardsArray = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];
  
  let CurrencyValues = {
    'Exalted': 999,
    'Divine': 99,
    'Annul': 99,
    'Mirror': 999
  };
  
  const SplitsArray = await GenerateSplitsArray(CurrencyValues["Exalted"]);

  return {
    props: {
      SplitsArray,
      CardsArray,
      CurrencyValues,
      Cookies: CookieData && CookieData
    }
  }
}

export default League;