import React from 'react';
import styles from '../index.module.css';
import fadeStyle from '../../Layout/index.module.css';

interface Props {
    children: React.ReactNode
}

export default function Wrapper({ children }: Props) {
  return (
        <div className={`${styles.gooey} ${fadeStyle.fadein1}`}>
            {children}
        </div>
  );
}
