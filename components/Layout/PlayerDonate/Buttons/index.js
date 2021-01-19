import Image from 'next/image';
import Link from 'next/link';
import styles from './index.module.css';

function DonateSection({ChannelName = "a"}) {
    return (
        <>
            <Link href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=ZGFRUQCHW3Y4S&source=url">
                <a className="m-1" target="_BLANK">
                    <Image 
                        className={styles.image}
                        src="https://img.shields.io/badge/Paypal-Donate-yellow.svg"
                        alt="Paypal Donate"
                        width={96}
                        height={20}
                    />
                </a>
            </Link>
            <Link alt="Steam Donate" href="https://trade.justazul.xyz/">
                <a className="m-2" target="_BLANK">
                    <Image 
                        className={styles.image}
                        src="https://img.shields.io/badge/Steam-Donate-yellow.svg"
                        alt="Steam Donate"
                        width={94}
                        height={20}
                    />
                </a>
            </Link>            
            <Link href={`https://www.twitch.tv/products/${ChannelName}/ticket`}>
                <a className="m-1" target="_BLANK">
                    <Image 
                        className={styles.image}
                        src="https://img.shields.io/badge/Twitch-Subscribe-blue.svg"
                        alt="Twitch Subscribe"
                        width={108}
                        height={20}
                    />
                </a>
            </Link>
        </>        
    );
}

export default DonateSection;