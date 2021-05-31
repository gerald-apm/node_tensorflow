const fs = require('fs');
const path = require('path');
let corndata = {
    corn: [],
};
let corn = [];

const cornfile = path.join(__dirname, '..', 'database', 'corndata.json');

const writeCorn = () => {
    corndata.corn = corn;
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
            corn = corndata.corn;
        }
    });
};

const deleteCorn = () => {
    corn.splice(0, corn.length);
    corndata.corn = [];
    const json = JSON.stringify(corndata);
    fs.writeFileSync(cornfile, json, 'utf8', callback);
};
module.exports = {corn, writeCorn, readCorn, deleteCorn};
