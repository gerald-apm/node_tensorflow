const path = require('path');
const {readFileUtil, writeFileUtil} = require('../utils/datawrite');
const cornfile = path.join(__dirname, '..', 'database', 'corndata.json');

const readFile = () => {
    try {
        const parsedjson = readFileUtil(cornfile);
        return parsedjson;
    } catch (err) {
        console.log(err);
        return;
    }
};

const writeFile = (arr) => {
    try {
        writeFileUtil(arr, cornfile);
        return;
    } catch (err) {
        console.log(err);
        return;
    }
};

module.exports = {writeFile, readFile};
