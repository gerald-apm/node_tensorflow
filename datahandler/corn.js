const fs = require('fs');
const path = require('path');
let corndata = {
    corn: [],
};

const cornfile = path.join(__dirname, '..', 'database', 'corndata.json');

const writeCorn = () => {
    const json = JSON.stringify(corndata);
    fs.writeFileSync(cornfile, json, 'utf8');
};

const readCorn = () => {
    fs.readFile(cornfile, 'utf8', (err, data) => {
        if (err) {
            console.log(err);
            throw Error('cannot read data!');
        } else {
            corndata = JSON.parse(data);
            console.log(corndata);
        }
    });
};

const deleteCorn = () => {
    corndata.corn = [];
    const json = JSON.stringify(corndata);
    fs.writeFileSync(cornfile, json, 'utf8');
};
module.exports = {corndata, writeCorn, readCorn, deleteCorn};
