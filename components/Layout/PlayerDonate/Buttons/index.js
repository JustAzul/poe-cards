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
                        src="/images/Paypal-Donate-yellow.svg"
                        alt="Paypal Donate"
                        width={96}
                        height={20}
                        priority
                    />
                </a>
            </Link>
            <Link alt="Steam Donate" href="https://trade.justazul.xyz/">
                <a className="m-2" target="_BLANK">
                    <Image 
                        className={styles.image}
                        src="/images/Steam-Donate-yellow.svg"
                        alt="Steam Donate"
                        width={94}
                        height={20}
                        priority
                    />
                </a>
            </Link>            
            <Link href={`https://www.twitch.tv/products/${ChannelName}/ticket`}>
                <a className="m-1" target="_BLANK">
                    <Image 
                        className={styles.image}
                        src="/images/Twitch-Subscribe-blue.svg"
                        alt="Twitch Subscribe"
                        width={108}
                        height={20}
                        priority
                    />
                </a>
            </Link>
        </>        
    );
}

export default DonateSection;