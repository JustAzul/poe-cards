import Head from 'next/head';
import Link from 'next/link';

import Dynamic from 'next/dynamic';
import Spinner from '../Spinner';
import Loader from '../Loader';

import {useStafe} from 'react';

const PlayerDonate = Dynamic(() => import('./PlayerDonate'), {loading: () => <Spinner/>});

const Layout = ({children, parent, title = "", margintop = false, IgnorePlayer = false}) => {
    const CurrentYear = new Date();
    const DevURL = "https://justazul.xyz";

    const [TransitionLoading, setTransitionLoading] = useState(false);

    const Transition = Dynamic(() => import('../Transition'), {loading: ({isLoading}) => {
        setTransitionLoading(isLoading);
        return <Spinner />
    }});

    if(TransitionLoading) return <Loader />;

    return (
        <>
            <Head>
                <title>{title == "" ? parent : title}</title>
                <link rel="icon" href="/images/InventoryIcon.png" />                               
            </Head>
            
            <Transition styles={`${margintop ? "container-fluid mt-5" : "container"}`}>
                {IgnorePlayer ? null : <div className="container pt-1 text-center"><PlayerDonate parent={parent} /></div>}
                {children}
            </Transition>
            
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