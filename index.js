var express = require('express');
const mappingCells = require('./mappingCells');
const retriveCellValue = require('./retriveCellValue');
var app = express();
const xlsxParser = require('./xlsxParser');
const xlsxXMap = require('./xlsxXMap');
const cors = require('cors');
const configuration = require('./configuration');
app.use(cors());

const mapping = xlsxXMap();

app.get('/', (req, res)=> {
    res.set('Access-Control-Allow-Origin','*');
    const value = retriveCellValue();
    res.json({result: 'ok', value: value, mapping: mapping})
})


app.get('/configuration/:family?/:tipology?/:category?', (req, res) => {
    res.set('Access-Control-Allow-Origin','*');
    const {family, tipology, category} = req.params;
    let response;

    if(family && tipology === undefined){
        configuration.categories.map((category, i) => {
            if(category.name  === family){
                res.json(category.categories);
            }
        })
    }
    else if(family && tipology){
        console.log(tipology);
        configuration.categories.map((category, i) => {
            if(category.name === family){
                category.categories.map((cat, x) => {
                    if(cat.name === tipology){
                        res.json(cat.categories);
                    }
                })
            }
        })
    }
    else(
        res.json(configuration.categories)
    )   
})

app.get('/tipology', (req, res) => {
    res.set('Access-Control-Allow-Origin','*');
    const tipology = Object.keys(mapping.info);
    res.json({response: 'ok', tipology: tipology});
})

app.get('/:tipology/strokes', (req, res) => {
    res.set('Access-Control-Allow-Origin','*');
    const {tipology} = req.params;
    const strokes = Object.keys(mapping.info[tipology].strokes);
    res.json({response: 'ok', tipology: tipology, strokes: strokes})
})

app.get('/:tipology/diameters', (req, res) => {
    res.set('Access-Control-Allow-Origin','*');
    const {tipology} = req.params;
    const diameters = Object.keys(mapping.info[tipology].diameters);
    res.json({response: 'ok', tipology: tipology, diameters: diameters})
})

app.get('/:tipology/:stroke/:diameter', (req, res) => {
    res.set('Access-Control-Allow-Origin','*');
    const {tipology, stroke, diameter} = req.params;
    const rawInfo = mapping.rawInfo;
    const column = mapping.info[tipology].diameters[diameter];
    const raw = mapping.info[tipology].strokes[stroke];
    const cost = mapping.rawInfo[tipology][raw][column];
    res.json({cost: cost})
})

app.get('*', (req, res) => {
    res.json({error: 404, msg: 'page not found'});
})

app.listen(3000);