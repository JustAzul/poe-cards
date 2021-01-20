import styles from './index.module.css';
import Image from 'next/image';

export default function DivCard({CardDetails}) {
    
    const {CardName, CardStack, Flavour, RewardName, artFilename, isCorrupted, rewardClass} = CardDetails['Details'];

    const GenerateCorruptedText = () => (
        <>
            <br></br>
            <span className={`${styles['text-color']} ${styles['-corrupted']}`}>Corrupted</span>
       </>
    );

    return (
        <span className={styles['divicard-wrapper']}>
            
            <span className={styles['divicard-art']}>
                <Image
                    src={`https://web.poecdn.com/image/divination-card/${artFilename}.png`}
                    width={200}
                    height={140}
                >                    
                </Image>
            </span>

            <span className={styles['divicard-frame']}>
                <Image
                src={`/images/cardbg.png`}
                    width={220}
                    height={334}
                ></Image>
            </span>

            <span className={styles['divicard-header']}>{CardName}</span>
            <span className={styles['divicard-stack']}>{CardStack}</span>

            <span className={styles['divicard-reward']}>
                <span>
                    <span className={`itemclass-${rewardClass}`}>{RewardName}</span>
                    {isCorrupted ? GenerateCorruptedText() : ``}
                </span>
            </span>

            <span className={`${styles['divicard-flavour']} ${styles['text-color']} ${styles['-flavour']}`}>
                <span>{Flavour}</span>
            </span>

        </span>
    );
}