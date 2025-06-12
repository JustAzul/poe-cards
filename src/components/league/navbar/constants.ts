/* eslint-disable import/prefer-default-export */
import AnnulOrb from 'public/images/AnnulOrb.png';
import DivineOrb from 'public/images/DivineOrb.png';
import ExaltedOrb from 'public/images/ExaltedOrb.png';
import MirrorKalandra from 'public/images/MirrorKalandra.png';
import { NavbarCurrency } from './types/navbar-currency.type';

export const NAVBAR_CURRENCIES: NavbarCurrency[] = [{
  name: 'Divine',
  img: DivineOrb,
  valueText: 'c',
},
{
  name: 'Exalted',
  img: ExaltedOrb,
  valueText: 'c',
}, {
  name: 'Annul',
  img: AnnulOrb,
  valueText: 'c',
}, {
  name: 'Mirror',
  img: MirrorKalandra,
  valueText: 'ex',
}];
