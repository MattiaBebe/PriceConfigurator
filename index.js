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
    let tipology, tipologyName, index, subcategory, charatteristics;
    if(req.params.category){
        arrayCategory = request.category.split("@");
    }
    if(arrayCategory){
        let response = configuration.categories;

        arrayCategory.forEach((category, i) => {
            response.map((cat, x) => {
                if(!cat.is_leaf){
                    if(cat.name === category){
                        response = cat.categories;
                    }
                }
                else{
                    if(cat.name === category){
                        level = 'leaf';
                        index = cat.index;
                        subcategory = cat.name;
                        charatteristics = cat.charatteristics;
                    }
                }   
                if(cat.is_page && cat.name === category){
                    tipology = cat.name;
                    tipologyName = cat.value;
                }
            })
        })
        res.json({level: level, tipology: tipology, subcategory: subcategory, index: index, tipologyName: tipologyName, response: response, charatteristics: charatteristics});
    }
    else{
        res.json({level: level, tipology: tipology, subcategory: subcategory, index: index, tipologyName: tipologyName, charatteristics: charatteristics, response: configuration.categories});
    }
})

app.get('/tipology', (req, res) => {
    res.set('Access-Control-Allow-Origin','*');
    const tipology = Object.keys(mapping.info);
    res.json({response: 'ok', tipology: tipology});
})

app.get('/:tipology/:tipologyIndex/strokes', (req, res) => {
    res.set('Access-Control-Allow-Origin','*');
    const {tipology, tipologyIndex} = req.params;
    const strokes = Object.keys(mapping.info[tipology][tipologyIndex].strokes);
    res.json({response: 'ok', tipology: tipology, strokes: strokes})
})

app.get('/:tipology/:tipologyIndex/diameters', (req, res) => {
    res.set('Access-Control-Allow-Origin','*');
    const {tipology, tipologyIndex} = req.params;
    const diameters = Object.keys(mapping.info[tipology][tipologyIndex].diameters);
    res.json({response: 'ok', tipology: tipology, diameters: diameters})
})

app.get('/caratteristicsValorization/:tipology/:diameter/:tipologyIndex/:key', (req, res) => {
    res.set('Access-Control-Allow-Origin','*');
    const {tipology,diameter, tipologyIndex, key} = req.params;
    const rawInfo = mapping.rawInfo;
    const raw = mapping.info[tipology][tipologyIndex].carateristics[key];
    const column = mapping.info[tipology][tipologyIndex].diameters[diameter];
    const value = mapping.rawInfo[tipology][raw][column];
    res.json({response: 'ok', value: value})
})

app.get('/:tipology/:stroke/:diameter/:tipologyIndex', (req, res) => {
    res.set('Access-Control-Allow-Origin','*');
    const {tipology, stroke, diameter, tipologyIndex} = req.params;
    const rawInfo = mapping.rawInfo;
    const column = mapping.info[tipology][tipologyIndex].diameters[diameter];
    const raw = mapping.info[tipology][tipologyIndex].strokes[stroke];
    const cost = mapping.rawInfo[tipology][raw][column];
    res.json({cost: cost})
})

app.get('*', (req, res) => {
    res.json({error: 404, msg: 'page not found'});
})

app.listen(3000);