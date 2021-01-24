import styles from './index.module.css';

export default function CardFlavour({Flavour}) {
    const ParseFlavour = F => {
        const Size = F.toString().match(/(<).+(>)/g);
        const ParsedFlavour = F.toString().replace(/(<).+(>)/g,'');

        if (Size) {
            try {
                const SizeValue = parseInt(Size[0].split(":")[1]);
                
                const NewStyle = {
                    "font-size": `${parseInt(SizeValue/2.9)}px`
                };

                return (
                    <span style={NewStyle}>
                        {ParsedFlavour}
                    </span>
                );
            } catch(e) {}
        }

        return ParsedFlavour;
    };
    return (
        <span className={`${styles['divicard-flavour']} ${styles['text-color']} ${styles['-flavour']}`}>
            <span>
                {ParseFlavour(Flavour)}
            </span>
         </span>
    );
}