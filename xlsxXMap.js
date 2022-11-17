const res = require('express/lib/response');
const reader = require('xlsx');
const file = reader.readFile('Listino.xlsx');
const _ = require('lodash'); 

let data = [];
let stroke = [];
let info = {};
let rawInfo = [];

module.exports = () => {
    const sheets = file.SheetNames;
    console.log(file.SheetNames);
    sheets.map((s) => {
        const rows = reader.utils.sheet_to_json(file.Sheets[s]);
        rawInfo[s] = rows;
        info[s] = {};
        const strokes = {};
        const strokesEnd = rows.findIndex(r => r.__EMPTY === 'Varianti / Variants')
            Object.values(rows).map((row, i) => {
                if(i < strokesEnd){ 
                    if(row.__EMPTY === 'Diametro (ø)'){
                        const diameters = {};
                        Object.entries(row).map((d) => {
                            diameters[`${d[1]}`] = d[0];
                        });
                        info[s].diameters = diameters;
                        }
                    else if(_.isNumber(row.__EMPTY)){
                        strokes[`${row.__EMPTY}`] = i;
                    }
                }
            })
        info[s].strokes = strokes;
    })
    const exampleColumn = info.ISO6432.diameters['10'];
    const exampleRaw = info.ISO6432.strokes['100'];
    const example = rawInfo.ISO6432[exampleRaw][exampleColumn];
    console.log(example)
    return(info)
}   