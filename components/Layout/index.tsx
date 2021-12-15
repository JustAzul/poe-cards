import Head from 'next/head';
import Link from 'next/link';

import Dynamic from 'next/dynamic';
import Spinner from '../Spinner';

const PlayerDonate = Dynamic(() => import('./PlayerDonate'), { loading: () => <Spinner/> });

interface Props {
    children: React.ReactNode,
    parent: string,
    title: string,
    margintop?: Boolean,
    IgnorePlayer?: Boolean
}

const Layout = ({
  children, parent, title, margintop = false, IgnorePlayer = false,
}: Props) => {
  const CurrentYear: Date = new Date();
  const DevURL: string = 'https://github.com/JustAzul/poe-cards';

  return (
        <>
            <Head>
                <title>{title} </title>
                <link rel="icon" href="/images/InventoryIcon.png" />
            </Head>

            <div className={`${margintop ? 'container-fluid mt-5' : 'container'}`}>
                {!IgnorePlayer && <div className="container pt-1 text-center"><PlayerDonate parent={parent} /></div>}
                {children}
            </div>

            <div className="text-center mt-2 pb-3">
                <footer className="blockquote-footer">
                    Copyright © <cite title={parent}><Link href="/"><a className="text-decoration-none">{parent}</a></Link></cite> 2019 - {CurrentYear.getFullYear()}. Powered by <cite title="poe.ninja"><Link href="https://poe.ninja/"><a className="text-decoration-none" target="_BLANK">poe.ninja</a></Link></cite>, Developed by <cite
                    title="Azul"><Link href={DevURL}><a className="text-decoration-none" target="_BLANK">Azul</a></Link></cite>.
                </footer>
            </div>
        </>
  );
};

export default Layout;
