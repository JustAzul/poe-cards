import styles from './index.module.css';

interface Props {
    RewardName: string,
    rewardClass: string,
    isCorrupted: Boolean
}

export default function CardReward({ RewardName, rewardClass, isCorrupted }: Props) {
  const GenerateCorruptedText: Function = () => (
        <>
            <br></br>
            <span className={`${styles['text-color']} ${styles['-corrupted']}`}>Corrupted</span>
       </>
  );

  return (
        <span className={styles['divicard-reward']}>
                <span>
                    <span className={`${styles[`itemclass-${rewardClass}`]}`}>{RewardName}</span>
                    {isCorrupted ? GenerateCorruptedText() : ''}
                </span>
            </span>
  );
}
