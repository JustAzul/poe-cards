import numeral from 'numeral';

export default function formatNumber(value: number): string {
  return numeral(value).format('0,0');
}
