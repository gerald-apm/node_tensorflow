const fs = require('fs');
const path = require('path');
const cornfile = path.join(__dirname, '..', 'database', 'corndata.json');

const readFile = () => {
    try {
        const jsonString = fs.readFileSync(cornfile, 'utf8');
        const parsedjson = JSON.parse(jsonString);
        console.log('read completed');
        console.log(parsedjson);
        return parsedjson;
    } catch (err) {
        console.log(err);
        return;
    }
};

const writeFile = (arr) => {
    try {
        const jsonString = JSON.stringify(arr);
        fs.writeFileSync(cornfile, jsonString);
        console.log('write completed');
        return;
    } catch (err) {
        console.log(err);
        return;
    }
};

module.exports = {writeFile, readFile};
