import Image from 'next/image';
import styles from './index.module.css';

interface Props {
    children: React.ReactNode,
    img: string
}

export default function Currency({ img, children }: Props) {
  return (
        <div className="row col-sm ml-1">
                    <Image className={styles.image} src={`/images/${img}.png`} width={24} height={24}/>
                    <div className="ml-1">
                        {children}
                    </div>
                </div>
  );
}
