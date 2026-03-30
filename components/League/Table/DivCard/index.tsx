import { memo } from 'react';
import styles from './index.module.css';

import CardArt from './CardArt';
import CardFrame from './CardFrame';
import CardReward from './CardReward';
import CardFlavour from './CardFlavour';

import type { CardDetail, Card } from '../../../../hooks/interfaces';

interface Props {
    CardDetails: Card
}

function DivCard({ CardDetails }: Props) {
  const {
    CardName, CardStack, Flavour, RewardName, artFilename, isCorrupted, rewardClass,
  }: CardDetail = CardDetails.Details;

  return (
        <span className={styles['divicard-wrapper']}>

            <CardArt artFilename={artFilename}/>
            <CardFrame/>

            <span className={styles['divicard-header']}>{CardName}</span>
            <span className={styles['divicard-stack']}>{CardStack}</span>

            <CardReward RewardName={RewardName} rewardClass={rewardClass} isCorrupted={isCorrupted}/>
            <CardFlavour Flavour={Flavour}/>

        </span>
  );
}

export default memo(DivCard);
