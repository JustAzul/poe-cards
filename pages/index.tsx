import { GetServerSideProps } from 'next';
import Dynamic from 'next/dynamic';
import CentralSpinner from '../components/CentralSpinner';

import Layout from '../components/Layout';
const SelectLeagueTable = Dynamic(() => import('../components/Table'), {loading: () => <CentralSpinner />});

import {useEffect, useState} from 'react';

import type {SocketIoClient} from '../hooks/useSocket';
import {Leagues} from '../hooks/interfaces';

interface Props {
  host: string,
  SocketIO: SocketIoClient
}

function Home({host, SocketIO}: Props) {
  const [LeagueDetails, setLeagueDetails] = useState<Array<Leagues>>([]);

  const HandleListData = (data: Object) => setLeagueDetails(Object.values(data));

  useEffect(() => {
    if (SocketIO) {
      SocketIO.emit("getLeagueList");
      SocketIO.on("LeagueListData", HandleListData);
    }

    return () => {
      try {
        SocketIO.off("LeagueListData", HandleListData);
      } catch (err) {}
    };

  }, [SocketIO]);
  
  return (
    <Layout parent={host} title="Pick a League">
      <SelectLeagueTable LeagueDetails={LeagueDetails} />
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({req}) => {

  const Headers = req['headers'];
  const host = Headers['x-forwarded-server'] ?? Headers['host'] ?? "poe.cards";

  return {
      props: {
        host
      }
  };
}

export default Home;