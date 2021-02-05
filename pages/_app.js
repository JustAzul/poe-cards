import '../styles/util.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/main.css';
import '../styles/globals.css';

import { CookiesProvider } from "react-cookie";
import {useEffect, useState} from 'react';
import useSocket from "../hooks/useSocket";

import { motion } from 'framer-motion';
import Loader from '../components/Loader';

function MyApp({ Component, pageProps, router }) {  
  const SocketIO = useSocket();  

  const [isLoading, setLoading] = useState(false);
  const [isSocketConnected, setSocketState] = useState(false);

  const HandleSocket = () => {
    setSocketState(SocketIO['connected']);
  };

  useEffect(() => {
    if (SocketIO) {
      SocketIO.on("connect", HandleSocket);
      SocketIO.on("disconnect", HandleSocket);
    }

    return () => {
      try {
        SocketIO.off("connect", HandleSocket);
        SocketIO.off("disconnect", HandleSocket);
      } catch (e) {}
    };
  }, [SocketIO]);

  useEffect(() => {
    const handleStart = url => (url !== router.asPath) && setLoading(true);
    const handleComplete = url => (url === router.asPath) && setLoading(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      try {
        router.events.off('routeChangeStart', handleStart);
        router.events.off('routeChangeComplete', handleComplete);
        router.events.off('routeChangeError', handleComplete);
      } catch (e) {}
    }
  }, [router.asPath]);

  const start = {
    opacity: 0
  }

  const end = {
    opacity: 1
  }

  return (
    <>
      {isLoading ? <Loader /> : <CookiesProvider> <motion.div initial={start} animate={end} exit={start}> <Component SocketIO={SocketIO} isSocketConnected={isSocketConnected} {...pageProps} /> </motion.div> </CookiesProvider>}
    </>
    );
}

export default MyApp;