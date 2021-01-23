const numeral = require('numeral');
const formatNumber = number => numeral(number).format('0,0');

 module.exports = formatNumber;