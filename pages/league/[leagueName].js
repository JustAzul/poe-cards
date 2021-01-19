import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import Nav from '../../components/Navbar';

const League = () => {
  const router = useRouter();
  const { leagueName } = router.query;

  return ( <>
       
        <Layout parent="localhost" title={leagueName}>            
            main
        </Layout>
      </>
  );
}

export default League