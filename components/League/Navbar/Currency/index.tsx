import React from 'react';
import Image from 'next/image';
import styles from './index.module.css';

interface Props {
    children: React.ReactNode,
    // eslint-disable-next-line no-undef
    img: StaticImageData
}

export default function Currency({ img, children }: Props) {
  return (
        <div className="row col-sm ml-1">
                    <Image placeholder="blur" className={styles.image} src={img} width={24} height={24}/>
                    <div className="ml-1">
                        {children}
                    </div>
                </div>
  );
}
