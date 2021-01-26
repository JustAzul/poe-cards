import Image from 'next/image';

export default function Img({artFileName}) {
    return (
        <Image
            src={`/images/${artFileName}.png`}
            width={24}
            height={24}
            priority={true} 
            loading="eager"
        />
    );
}