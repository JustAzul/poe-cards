import styles from './index.module.css';

interface Props {
    RewardName: string,
    rewardClass: number | null,
    isCorrupted: Boolean
}

export default function CardReward({ RewardName, rewardClass, isCorrupted }: Props) {
  const GenerateCorruptedText: Function = () => (
        <>
            <br></br>
            <span className={`${styles['text-color']} ${styles['-corrupted']}`}>Corrupted</span>
       </>
  );

  const itemClassKey = rewardClass === null ? '00' : rewardClass;

  return (
        <span className={styles['divicard-reward']}>
                <span>
                    <span className={`${styles[`itemclass-${itemClassKey}`]}`}>{RewardName}</span>
                    {isCorrupted ? GenerateCorruptedText() : ''}
                </span>
            </span>
  );
}
