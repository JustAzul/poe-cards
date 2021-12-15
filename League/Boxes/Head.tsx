import styles from './index.module.css';

interface Props {
    children: React.ReactNode
}

export default function Head({ children }: Props) {
  return (
        <div className={`pl-2 pr-2 text-center ${styles.header2} user-select-none`}>
            {children}
        </div>
  );
}
