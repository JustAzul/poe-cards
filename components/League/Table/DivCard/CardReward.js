import styles from './index.module.css';

export default function CardReward({RewardName, rewardClass, isCorrupted}) {
    
    const GenerateCorruptedText = () => (
        <>
            <br></br>
            <span className={`${styles['text-color']} ${styles['-corrupted']}`}>Corrupted</span>
       </>
    );

    return (
        <span className={styles['divicard-reward']}>
                <span>
                    <span className={`${styles[`itemclass-${rewardClass}`]}`}>{RewardName}</span>
                    {isCorrupted ? GenerateCorruptedText() : ``}
                </span>
            </span>
    );
}