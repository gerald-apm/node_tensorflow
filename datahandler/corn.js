const fs = require('fs');
const path = require('path');
let corndata = {
    corn: [],
};

const cornfile = path.join(__dirname, '..', 'database', 'corndata.json');

const writeCorn = async () => {
    const json = JSON.stringify(corndata);
    await fs.writeFile(cornfile, json, 'utf8');
};

const readCorn = async () => {
    await fs.readFile(cornfile, 'utf8', (err, data) => {
        if (err) {
            console.log(err);
            throw Error('cannot read data!');
        } else {
            corndata = JSON.parse(data);
            console.log(corndata);
        }
    });
};

const deleteCorn = async () => {
    corndata.corn = [];
    const json = JSON.stringify(corndata);
    await fs.writeFile(cornfile, json, 'utf8');
};
module.exports = {corndata, writeCorn, readCorn, deleteCorn};
