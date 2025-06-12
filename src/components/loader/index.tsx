/* eslint-disable import/extensions */
import Head from 'next/head';

// eslint-disable-next-line import/no-unresolved
import LoaderWrapper from './raw-loader/Wrapper';
import RawLoader from './raw-loader';

interface Props {
    title?: string,
    detail?: string,
}

function Loader({ title = 'Loading', detail }: Props) {
  return (
        <>
            <Head>
                <title>{title}</title>
                <link rel="icon" href="/images/InventoryIcon.png" />
            </Head>

            <LoaderWrapper>
                <RawLoader detail={detail} />
            </LoaderWrapper>

        </>
  );
}

export default Loader;
