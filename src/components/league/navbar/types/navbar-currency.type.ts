import { CurrencyValues } from '@/hooks/interfaces';
import { StaticImageData } from 'next/image';

export type NavbarCurrency = {
 name: keyof CurrencyValues;
 img: StaticImageData;
 valueText: 'c' | 'ex'
}
