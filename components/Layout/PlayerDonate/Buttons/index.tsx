import Image from 'next/image';
import Link from 'next/link';
import styles from './index.module.css';

interface Props {
    ChannelName: string
}

function DonateSection({ ChannelName }: Props) {
  return (
        <>
            <Link href="https://www.paypal.com/donate?hosted_button_id=9KDR83JWCKAQW">
                <a className="m-1" target="_BLANK">
                    <Image
                        className={styles.image}
                        src="/images/Paypal-Donate-yellow.svg"
                        alt="Paypal Donate"
                        width={96}
                        height={20}
                        priority={true}
                        loading="eager"
                    />
                </a>
            </Link>
            <Link href="https://trade.justazul.xyz/">
                <a className="m-2" target="_BLANK">
                    <Image
                        className={styles.image}
                        src="/images/Steam-Donate-yellow.svg"
                        alt="Steam Donate"
                        width={94}
                        height={20}
                        priority={true}
                        loading="eager"
                    />
                </a>
            </Link>
           {/*  <Link href={`https://www.twitch.tv/products/${ChannelName}/ticket`}>
                <a className="m-1" target="_BLANK">
                    <Image
                        className={styles.image}
                        src="/images/Twitch-Subscribe-blue.svg"
                        alt="Twitch Subscribe"
                        width={108}
                        height={20}
                        priority={true}
                        loading="eager"
                    />
                </a>
            </Link> */}
        </>
  );
}

export default DonateSection;
