const reader = require('xlsx');
const workbook = reader.readFile('Listino.xlsx');
const XlsxPopulate = require('xlsx-populate');
const Workbook = require('xlsx-populate/lib/Workbook');
let value = 0;

module.exports = () => {
    XlsxPopulate.fromFileAsync('./Listino.xlsx').then(
        Workbook => {
            value = Workbook.sheet('ISO6432').cell('G22').value();
            console.log(value);
        }
    )
}