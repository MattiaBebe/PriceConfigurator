const res = require('express/lib/response');
const reader = require('xlsx');
const file = reader.readFile('Listino.xlsx');
const _ = require('lodash'); 

let data = [];
let diameters = [];
let stroke = []
let info = {};

module.exports = () => {
    const sheets = file.SheetNames;
    console.log(file.SheetNames);
    // for(let i = 0; i < sheets.length; i++){
    sheets.map((s, i) => {
            
        info[s] = reader.utils.sheet_to_json(
            // file.Sheets[file.SheetNames[i]]
            file.Sheets[s]
        )
        Object.values(info).map((res, k) => {
            // if(file.SheetNames[i] == 'ISO6432'){
            if(s = 'ISO6432'){ 
                if(res.__EMPTY == 'Diametro (ø)'){
                        diameters = Object.entries(res);
                        data.push({tipologia: s, diameters: diameters})
                    }
                    else{
                        console.log(res)
                        if(_.isNumber(res.__EMPTY)){
                            let values = [];
                            let strokeVal = 0;
                            let x = 0;
                            Object.entries(res).forEach(entry => {
                                const [keys, value] = entry;
                                if(keys == '__EMPTY'){strokeVal = value;}
                                if(keys !== '__EMPTY'){
                                    values.push({diameter: diameters[x], value: value});
                                }
                                x = x + 1;
                            });
                            stroke.push({stroke: strokeVal, values: values})
                        }
                    }
                }
         })
    })
    const example = info.ISO6432.diameters.find(d => 8);
    return({data: data, example: example})
}   