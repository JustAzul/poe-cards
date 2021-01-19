import Head from 'next/head';
import Link from 'next/link';
import PlayerDonate from '../PlayerDonate';
//import Nav from '../Navbar';

const Layout = ({children, parent, title = "poe.cards"}) => {
    const CurrentYear = new Date();
    const DevURL = "https://justazul.xyz";
    return (
        <>
            <Head>
                <title>{title}</title>
                <link rel="icon" href="/images/InventoryIcon.png"></link>
            </Head>
            
            <main className="container">
                <PlayerDonate parent={parent}></PlayerDonate>
                {children}
            </main>
            
            <div className="text-center mt-4">
                <footer className="blockquote-footer">
                    Copyright © <cite title={parent}><Link href="/"><a className="text-decoration-none">{parent}</a></Link></cite> 2019 - {CurrentYear.getFullYear()}. Powered by <cite title="poe.ninja"><Link href="https://poe.ninja/"><a className="text-decoration-none" target="_BLANK">poe.ninja</a></Link></cite>, Developed by <cite
                    title="Azul"><Link href={DevURL}><a className="text-decoration-none" target="_BLANK">Azul</a></Link></cite>.
                </footer>
            </div>
            
        </>        
    );
};

export default Layout;