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
    const handleRouteChange = (url: any) => {
      gtag.pageview(url);
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  useEffect(() => {
    const handleStart = (url: string) => (url !== router.asPath) && setLoading(true);

    const handleComplete = (url: string) => {
      if (url === router.asPath) setLoading(false);
    };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      try {
        router.events.off('routeChangeStart', handleStart);
        router.events.off('routeChangeComplete', handleComplete);
        router.events.off('routeChangeError', handleComplete);
      } catch {}
    };
  }, [router.asPath]);

  if (isLoading) return <Loader />;

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
      <CookiesProvider>
        <Component {...pageProps} />
      </CookiesProvider>
    </>
  );
}

export default MyApp;
