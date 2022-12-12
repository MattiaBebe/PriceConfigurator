const res = require('express/lib/response');
const reader = require('xlsx');
const file = reader.readFile('Listino.xlsx');
const _ = require('lodash'); 

let data = [];
let stroke = [];
let info = {};
let rawInfo = [];

const isDiameterCell = (data) => {
    return data === 'Diametro (ø)' || data === 'Diametro/Bore (ø)'
}

module.exports = () => {
    const sheets = file.SheetNames;
    console.log(file.SheetNames);
    sheets.map((s) => {
        const rows = reader.utils.sheet_to_json(file.Sheets[s]);
        let diameterIndex = 0;
        let strokeIndex = -1;
        rawInfo[s] = rows;
        info[s] = {};
        const strokes = {};
        Object.values(rows).map((row, i) => {
            if(isDiameterCell(row.__EMPTY)){
                info[s][diameterIndex] = {};    
                diameterIndex++;
            }
        })
        diameterIndex = 0;
        Object.values(rows).map((row, i) => { 
            if(isDiameterCell(row.__EMPTY)){
                const diameters = {};
                Object.entries(row).map((d) => {
                    diameters[`${d[1]}`] = d[0];
                });
                info[s][diameterIndex].diameters = diameters;
                diameterIndex++;
            }
            else if(row.__EMPTY === 'Corsa/Stroke (mm)'){
                strokeIndex++;
                try{
                    info[s][strokeIndex].strokes = {}
                }
                catch(e){
                    console.log(e)
                }
            }
            else if(_.isNumber(row.__EMPTY)){
                // strokes[`${row.__EMPTY}`] = i;
                try{
                    info[s][strokeIndex].strokes[`${row.__EMPTY}`] = i;
                }
                catch(e){
                    console.log(e)
                };
            }
        })
        // if(info[s][strokeIndex] ){
        //     info[s][strokeIndex].strokes = strokes;
        // }
        // else{
        //     info[s].strokes = strokes;
        // }
    })
    // const exampleColumn = info.ISO6432.diameters['10'];
    // const exampleRaw = info.ISO6432.strokes['100'];
    // const example = rawInfo.ISO6432[exampleRaw][exampleColumn];
    // console.log(example)
    return({info, rawInfo})
}   