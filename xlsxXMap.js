const res = require('express/lib/response');
const reader = require('xlsx');
const file = reader.readFile('Listino.xlsx');
const _ = require('lodash'); 

const excludedPages = [
    'kit ISO15552',
    'kit cnomo',
    'kit CP04',
    'kit CP95',
    'kit SERIE E',
    'kit ISO6432 inox-stainless stee',
    'kit CP04 inox-stainless steel',
    'kit CP95 inox-stainless steel',
    'kit 15552 304-stainless steel',
    'kit 15552 316-stainless steel',
    'kit 21287-stainless steel'
];

let data = [];
let stroke = [];
let info = {};
let rawInfo = [];
let errors = [];

const isDiameterCell = (data) => {
    return data === 'Diametro (ø)' || data === 'Diametro/Bore (ø)'
}

const carateristics = [
    'PASSANTE - THROUGH ROD',
    'STELO AISI316 - SS316 ROD',
    'STELO PROLUNGATO - ROD EXTENSION (mm)'
];

const isThrough = (data) => {
    return data === 'PASSANTE - THROUGH ROD'
}

const isAISI = (data) => {
    return data === 'PASSANTE - THROUGH ROD'
}

const isCharateristic = (data) => {
    return isThrough(data) || isAISI(data) 
}

module.exports = () => {
    const sheets = file.SheetNames;
    console.log(file.SheetNames);
    sheets.filter((s) => !excludedPages.includes(s))
    sheets.map((s) => {
        const rows = reader.utils.sheet_to_json(file.Sheets[s]);
        let tipologyIndex = 0;
        let through = 0;
        let strokeIndex = -1;
        rawInfo[s] = rows;
        info[s] = {};
        const strokes = {};
        Object.values(rows).map((row, i) => {
            if(isDiameterCell(row.__EMPTY)){
                info[s][tipologyIndex] = {}; 
                info[s][tipologyIndex].carateristics = {}
                tipologyIndex++;
            }
            // if(isThrough(row.__EMPTY)){
            //     info[s][through] = {};
            //     through++;
            // }
        })
        tipologyIndex = 0;
        through = 0;
        Object.values(rows).map((row, i) => { 
            if(isDiameterCell(row.__EMPTY)){
                const diameters = {};
                Object.entries(row).map((d) => {
                    diameters[`${d[1]}`] = d[0];
                });
                info[s][tipologyIndex].diameters = diameters;
                tipologyIndex++;
            }
            else if(carateristics.includes(row.__EMPTY)){
                try{
                    info[s][tipologyIndex-1].carateristics[row.__EMPTY] = i;
                }
                catch(e){errors.push(s)}
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
                try{
                    info[s][strokeIndex].strokes[`${row.__EMPTY}`] = i;
                }
                catch(e){
                    console.log(e)
                };
            }
        })
        console.log(errors)
    })
    // const exampleColumn = info.ISO6432.diameters['10'];
    // const exampleRaw = info.ISO6432.strokes['100'];
    // const example = rawInfo.ISO6432[exampleRaw][exampleColumn];
    // console.log(example)
    return({info, rawInfo})
}   