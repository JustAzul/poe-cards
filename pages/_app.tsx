/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */

import '../styles/util.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/main.css';
import '../styles/globals.css';

import type { AppProps } from 'next/app';

import { CookiesProvider } from 'react-cookie';
import { useEffect, useState } from 'react';
import { MotionConfig, ExitFeature, AnimationFeature } from 'framer-motion';
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
    <MotionConfig features={[ExitFeature, AnimationFeature]}>
      <CookiesProvider>
        <Component {...pageProps} />
      </CookiesProvider>
    </MotionConfig>
  );
}

export default MyApp;
