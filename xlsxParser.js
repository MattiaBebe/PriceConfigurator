const { isNumberObject } = require('util/types');
const reader = require('xlsx');
const _ = require('lodash'); 
const { values } = require('lodash');

const file = reader.readFile('./Listino.xlsx');
let data = [];
let diameters = [];
let stroke = []
let category = '';

module.exports = () => {
    const sheets = file.SheetNames;
    console.log(file.SheetName);
    
        for(let i = 0; i < sheets.length; i++){
            const temp = reader.utils.sheet_to_json(
                file.Sheets[file.SheetNames[i]]
            )
            temp.forEach((res) => {
                category = file.SheetNames[i];
                if(file.SheetNames[i] == 'ISO6432'){
                    if(res.__EMPTY == 'Diametro (ø)'){
                        diameters = Object.values(res);
                        let diameterList = Object.values(res);
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
        data.push({category: category, info: stroke})
        }
    return(data)
}