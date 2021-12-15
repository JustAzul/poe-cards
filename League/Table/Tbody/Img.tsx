import Image from 'next/image';

interface Props {
    artFileName: string
}

export default function Img({ artFileName }: Props) {
  return (
        <Image
            // placeholder="blur"
            src={`/images/${artFileName}.png`}
            width={24}
            height={24}
        />
  );
}
