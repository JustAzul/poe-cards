import numeral from 'numeral';
const formatNumber = (number: Number) => numeral(number).format('0,0');
module.exports = formatNumber;