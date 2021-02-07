import { CSSProperties } from 'react';
import styles from './index.module.css';

interface Props {
    Flavour: string
}

export default function CardFlavour({Flavour}: Props) {
    
    const ParseFlavour = () => {
        const Size: RegExpMatchArray | null = Flavour.match(/(<).+(>)/g);
        const ParsedFlavour: string = Flavour.replace(/(<).+(>)/g, '');

        if (Size) {
            try {
                const SizeValue: number = parseInt(Size[0].split(":")[1]) / 2.9;
                
                const NewStyle: CSSProperties = {
                    fontSize: `${SizeValue.toString()}px`
                };

                return (
                    <span style={NewStyle}>
                        {ParsedFlavour}
                    </span>
                );
            } catch {}
        }

        return ParsedFlavour;
    };

    return (
        <span className={`${styles['divicard-flavour']} ${styles['text-color']} ${styles['-flavour']}`}>
            <span>
                {ParseFlavour()}
            </span>
         </span>
    );
}