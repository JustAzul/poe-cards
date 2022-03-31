/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */

import '../styles/util.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/main.css';
import '../styles/globals.css';

import type { AppProps } from 'next/app';
import { CookiesProvider } from 'react-cookie';
import { useEffect, useState } from 'react';

import Script from 'next/script';
import * as gtag from '../lib/gtag';

import Loader from '../components/Loader';

function MyApp({ Component, pageProps, router }: AppProps) {
  const [isLoading, setLoading] = useState<Boolean>(false);

  useEffect(() => {
    const handleStart = (url: string) => (url !== router.asPath) && setLoading(true);

    const handleComplete = (url: string) => {
      gtag.pageview(url);
      if (url === router.asPath) setLoading(false);
    };

    const handleError = (url: string) => {
      if (url === router.asPath) setLoading(true);
    };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleError);

    return () => {
      try {
        router.events.off('routeChangeStart', handleStart);
        router.events.off('routeChangeComplete', handleComplete);
        router.events.off('routeChangeError', handleError);
      } catch {}
    };
  }, [router.asPath, router.events]);

  if (isLoading) return <Loader detail='Loading Components..'/>;

  return (
    <>
      {/* Global Site Tag (gtag.js) - Google Analytics */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gtag.GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />

      <Script
          id="Adsense-id"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-${process.env.NEXT_PUBLIC_ADSENSE_ID}`}
          async
          // crossorigin="anonymous"
          strategy="afterInteractive"
          // eslint-disable-next-line no-console
          onError={ (e) => { console.error('AdSense script failed to load', e); }}
      />

      <CookiesProvider>
        <Component {...pageProps} />
      </CookiesProvider>
    </>
  );
}

export default MyApp;
