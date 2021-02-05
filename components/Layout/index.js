import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';

import Dynamic from 'next/dynamic';
import Spinner from '../Spinner';

const PlayerDonate = Dynamic(() => import('./PlayerDonate'), {loading: () => <Spinner/>});

const Layout = ({children, parent, title = "", margintop = false, IgnorePlayer = false}) => {
    const CurrentYear = new Date();
    const DevURL = "https://justazul.xyz";

    const start = {
        opacity: 0
    }

    const end = {
        opacity: 1
    };

    return (
        <>
            <Head>
                <title>{title == "" ? parent : title}</title>
                <link rel="icon" href="/images/InventoryIcon.png" />                               
            </Head>
            
            <motion.div initial={start} animate={end} exit={start} className={`${margintop ? "container-fluid mt-5" : "container"}`}>
                {IgnorePlayer ? "" : <div className="container pt-1 text-center"><PlayerDonate parent={parent} /></div>}
                {children}
            </motion.div>
            
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