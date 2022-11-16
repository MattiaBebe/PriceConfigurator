var express = require('express');
var app = express();
const xlsxParser = require('./xlsxParser');

app.get('/', (req, res)=> {
    const data = xlsxParser();
    res.json({response: 'ok', dati: data});
})

app.listen(3000);