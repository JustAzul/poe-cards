/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */

import '../styles/util.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/main.css';
import '../styles/globals.css';

import * as gtag from '@/lib/gtag';

import { useEffect, useState } from 'react';

import type { AppProps } from 'next/app';
import Loader from '@/components/loader';
import Script from 'next/script';

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
          async
          onError={(e) => { console.error('Adsense Script failed to load', e); }}
          strategy="afterInteractive"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-${process.env.NEXT_PUBLIC_ADSENSE_CA_PUB_ID}`}
          crossOrigin="anonymous"
        />

      {/* <Script
        id="Adsense-id"
        data-ad-client={`ca-pub-${process.env.NEXT_PUBLIC_ADSENSE_CA_PUB_ID}`}
        async strategy="afterInteractive"
        onError={ (e) => { console.error('Adsense Script failed to load', e); }}
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
      /> */}

        <Component {...pageProps} />
    </>
  );
}

export default MyApp;
