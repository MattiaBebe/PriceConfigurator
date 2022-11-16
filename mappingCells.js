const res = require('express/lib/response');
const reader = require('xlsx');
const file = reader.readFile('Listino.xlsx');
const _ = require('lodash'); 

let data = [];
let diameters = [];
let stroke = []

module.exports = () => {
    const sheets = file.SheetNames;
    console.log(file.SheetNames);
    for(let i = 0; i < sheets.length; i++){
        const temp = reader.utils.sheet_to_json(
            file.Sheets[file.SheetNames[i]]
        )
        temp.forEach((res) => {
            if(file.SheetNames[i] == 'ISO6432'){
                if(res.__EMPTY == 'Diametro (ø)'){
                    diameters = Object.values(res);
                    let diameterList = Object.values(res);
                    data.push({tipologia: file.SheetNames[i], diameters: diameters})
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
    }
    return(sheets)
}   