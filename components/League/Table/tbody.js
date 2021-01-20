//import styles from './index.module.css';
import Image from 'next/image';

export default function thead({setToHover, toHover, Items}) {
    
    const chaosIMG = () => (
        <Image
            src="/images/ChaosOrb.png"
            width={24}
            height={24}
        ></Image>
    );

    const exIMG = () => (
        <Image
            src="/images/ExaltedOrb.png"
            width={24}
            height={24}
        ></Image>
    );

    const cardIMG = () => (
        <Image
            src="/images/InventoryIcon.png"
            width={24}
            height={24}
        ></Image>
    );
    
    return Items.map( () => {
        return (
            <tr className="row100">
                <td onMouseOver={() => setToHover("c1")} onMouseOut={() => setToHover("")} title="Card Name" className={`column100 column1 click${toHover === "c1" ? " hov-column-ver1" : ""}`}>{cardIMG()}lore</td>
                <td onMouseOver={() => setToHover("c2")} onMouseOut={() => setToHover("")} title="cardname Stack Size" className={`column100${toHover === "c2" ? " hov-column-ver1" : ""}`}>lore</td>
                <td onMouseOver={() => setToHover("c3")} onMouseOut={() => setToHover("")} title="cardname Chaos Price" className={`column100 click${toHover === "c3" ? " hov-column-ver1" : ""}`}>{chaosIMG()}lore</td>
                <td onMouseOver={() => setToHover("c4")} onMouseOut={() => setToHover("")} title="cardname Exalted Price" className={`column100 click${toHover === "c4" ? " hov-column-ver1" : ""}`}>{exIMG()}lore</td>
                <td onMouseOver={() => setToHover("c5")} onMouseOut={() => setToHover("")} title="cardname Stacked Chaos Value" className={`column100${toHover === "c5" ? " hov-column-ver1" : ""}`}>{chaosIMG()}lore</td>
                <td onMouseOver={() => setToHover("c6")} onMouseOut={() => setToHover("")} title="cardname Stacked Exalted Value" className={`column100${toHover === "c6" ? " hov-column-ver1" : ""}`}>{exIMG()}lore</td>
                <td onMouseOver={() => setToHover("c7")} onMouseOut={() => setToHover("")} title="cardname Chaos Value" className={`column100 click${toHover === "c7" ? " hov-column-ver1" : ""}`}>{chaosIMG()}lore</td>
                <td onMouseOver={() => setToHover("c8")} onMouseOut={() => setToHover("")} title="cardname Exalted Value" className={`column100 click${toHover === "c8" ? " hov-column-ver1" : ""}`}>{exIMG()}lore</td>
                <td onMouseOver={() => setToHover("c9")} onMouseOut={() => setToHover("")} title="Chaos Profit" className={`column100${toHover === "c9" ? " hov-column-ver1" : ""}`}>{chaosIMG()}lore</td>
                <td onMouseOver={() => setToHover("c10")} onMouseOut={() => setToHover("")} title="Exalted Profit" className={`column100${toHover === "c10" ? " hov-column-ver1" : ""}`}>{exIMG()}lore</td>
            </tr>
        );
    });
}