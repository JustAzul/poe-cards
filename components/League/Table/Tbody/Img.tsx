import Image from 'next/image';
import { memo } from 'react';

interface Props {
    // eslint-disable-next-line no-undef
    artFileName: StaticImageData
}

function Img({ artFileName }: Props) {
  return (
        <Image
            placeholder="blur"
            src={artFileName}
            width={24}
            height={24}
        />
  );
}

export default memo(Img);
