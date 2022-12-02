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


app.get('/configuration/:category?', (req, res) => {
    res.set('Access-Control-Allow-Origin','*');
    const request = req.params;
    let arrayCategory;
    let level = 'branch';
    let tipology, tipologyName;
    if(req.params.category){
        arrayCategory = request.category.split("@");
    }
    if(arrayCategory){
        let response = configuration.categories;
        arrayCategory.forEach((category, i) => {
            response.map((cat, x) => {
                if(cat.name){
                    if(cat.name === arrayCategory[i]){
                        response = cat.categories;
                    }
                }
                else{
                    if(cat.value === arrayCategory[i]){
                        level = 'leaf';
                        tipology = cat.key;
                        tipologyName = cat.value;
                    }
                }   
            })
        })
        res.json({level: level, tipology: tipology, tipologyName: tipologyName, response: response});
    }
    else{
        res.json({level: level, tipology: tipology, tipologyName: tipologyName, response: configuration.categories});
    }
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