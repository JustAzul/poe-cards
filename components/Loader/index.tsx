import Head from 'next/head';
import styles from './index.module.css';
import Dynamic from 'next/dynamic';

import LoaderWrapper from './RawLoader/Wrapper';
import RawLoader from './RawLoader'

const Transition = Dynamic(import('../Transition'), {loading: () => <LoaderWrapper> <RawLoader /> </LoaderWrapper>});

interface Props {
    title?: string
}

export default function Loader({title = "poe.cards"}: Props) {
    
    const transition: Object = {
        duration: 0.4
    }

    return (
        <>
            <Head>
                <title>{title}</title>
                <link rel="icon" href="/images/InventoryIcon.png" />
            </Head>

            <Transition transition={transition} styles={styles['gooey']}>
                <RawLoader />
            </Transition>
        </>
    );
};