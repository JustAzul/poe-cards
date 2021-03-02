import styles from './index.module.css';

interface Props {
    parent: string,
    ChannelName: string
}

function TwitchPlayer({ parent, ChannelName }: Props) {
  const autoplay: Boolean = true;
  const muted: Boolean = true;

  const SRC: string = `https://player.twitch.tv/?channel=${ChannelName}&autoplay=${autoplay}&muted=${muted}&parent=${parent}`;

  return <iframe className={styles.player} src={SRC} />;
}

export default TwitchPlayer;
