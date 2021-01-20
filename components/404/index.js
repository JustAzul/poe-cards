import Link from 'next/link';
import Image from 'next/image';
import styles from './index.module.css';

export default function PageError() {
    return (
        <div className="container">

            <div className="row">      

                <div className="col">
                    <div className="container m-3">
                        <div className="row p-3 pl-5 pr-5">
                            <div className="text-left col pl-5 pr-5 mr-5">
                            <div className={`${styles['notfound-2']}`}>
                                <div className={styles['notfound']}>
                                    <h1>404</h1>
                                    <h2>Whoops! League not Found.</h2>
                                    <p>Sorry but the page you are looking for does not exist, have been removed. name changed or is temporarily unavailable</p>
                                    <Link href={`/`}>
                                        <a>- Pick a league</a>
                                    </Link>
                                </div>
                            </div>
                            </div>

                        </div>
                    </div>                
                    
                </div>

            </div>

        </div>
    );
}