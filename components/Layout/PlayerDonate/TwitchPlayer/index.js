import styles from './index.module.css';

function TwitchPlayer({ parent, ChannelName }) {
    
    const autoplay = "true";
    const muted = "true";

    const SRC = `https://player.twitch.tv/?channel=${ChannelName}&autoplay=${autoplay}&muted=${muted}&parent=${parent}`;

    return <iframe className={styles.player} src={SRC} />;
}

export default TwitchPlayer;