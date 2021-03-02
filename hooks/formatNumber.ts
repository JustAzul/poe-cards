import numeral from 'numeral';

const formatNumber = (number: number): string => numeral(number).format('0,0');
module.exports = formatNumber;
