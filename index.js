var express = require('express');
const mappingCells = require('./mappingCells');
const retriveCellValue = require('./retriveCellValue');
var app = express();
const xlsxParser = require('./xlsxParser')

app.get('/', (req, res)=> {
    // const data = xlsxParser();
    const value = retriveCellValue();
    const mapping = mappingCells();
    // res.json({response: 'ok', dati: data});
    res.json({result: 'ok', value: value, mapping: mapping})
})

app.listen(3000);