import Image from 'next/image';

interface Props {
    // eslint-disable-next-line no-undef
    artFileName: StaticImageData
}

export default function Img({ artFileName }: Props) {
  return (
        <Image
            placeholder="blur"
            src={artFileName}
            width={24}
            height={24}
        />
  );
}
