const reader = require('xlsx');

const file = reader.readFile('./sheets.xlsx');
let data = [];

module.exports = () => {
    const sheets = file.SheetNames;

    for(let i = 0; i < sheets.length; i++){
        const temp = reader.utils.sheet_to_json(
            file.Sheets[file.SheetNames[i]]
        )
        temp.forEach((res) => {
            data.push(res)
        })
    }

    console.log(data);
    return(data)
}