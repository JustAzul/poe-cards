import Head from 'next/head';

import LoaderWrapper from './RawLoader/Wrapper';
import RawLoader from './RawLoader';

interface Props {
    title?: string,
    detail?: string,
}

export default function Loader({ title = 'poe.cards', detail }: Props) {
  return (
        <>
            <Head>
                <title>{title}</title>
                <link rel="icon" href="/images/InventoryIcon.png" />
            </Head>

            <LoaderWrapper> <RawLoader detail={detail} /> </LoaderWrapper> */
        </>
  );
}
