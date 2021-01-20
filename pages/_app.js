import '../public/assets/css/util.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../public/assets/fonts/font-awesome-4.7.0/css/font-awesome.min.css';
import '../public/assets/css/Mandali-font.css';
import '../public/assets/css/main.css';
import '../styles/globals.css';
import '../styles/table.css';

import { CookiesProvider } from "react-cookie";

function MyApp({ Component, pageProps }) {
  return (
    <CookiesProvider>
      <Component {...pageProps} />
    </CookiesProvider>
  );
}

export default MyApp
