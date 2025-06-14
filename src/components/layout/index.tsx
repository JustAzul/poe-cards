import Footer from './footer';
import Head from 'next/head';
import type { ReactNode } from 'react';
import fadeStyles from './index.module.css';

interface Props {
    children: ReactNode,
    parent: string,
    title: string,
    margintop?: boolean,
}

const Layout = ({
  children, parent, title, margintop = false,
}: Props) => (
        <>
            <Head>
                <title>{title} </title>
                <link rel="icon" href="/images/InventoryIcon.png" />
            </Head>

            <div className={fadeStyles.fadein1}>
                <div className={`${margintop ? 'container-fluid mt-5' : 'container'}`}>
                    {children}
                </div>
                <Footer parent={parent} />
            </div>
        </>
);

export default Layout;
