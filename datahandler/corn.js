const fs = require('fs');
const path = require('path');
let corndata = {
    corn: [],
};

const cornfile = path.join(__dirname, '..', 'database', 'corndata.json');

const writeCorn = () => {
    const json = JSON.stringify(corndata);
    fs.writeFileSync(cornfile, json, 'utf8');
    console.log('write completed');
};

const readCorn = () => {
    const rawdata = fs.readFileSync(cornfile, 'utf8');
    corndata = JSON.parse(rawdata);
    console.log(corndata);
};

const deleteCorn = () => {
    corndata.corn = [];
    const json = JSON.stringify(corndata);
    fs.writeFileSync(cornfile, json, 'utf8');
    console.log('delete completed');
};
module.exports = {corndata, writeCorn, readCorn, deleteCorn};
