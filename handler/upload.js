/* eslint-disable max-len */
const tf = require('@tensorflow/tfjs-node');
const {getImage} = require('../utils/loadImage');
const {writeFile, readFile} = require('../datahandler/upload');
const path = require('path');
const hostname = require('../utils/localhost');
const fs = require('fs');

const {labelcorn, labelpotato, labeltomato} = require('../utils/labels')

let modelfile = null;

const argMax = (array) => {
    return [].reduce.call(array, (m, c, i, arr) => c > arr[m] ? i : m, 0);
};

let uploadfiles = {
    files: [],
};

const getUploadHandler = (req, res) => {
    try {
        uploadfiles = readFile();
        let files = null;
        const {model} = req.query;
        if (model)
            files = uploadfiles.files.filter((b) => b.model.toLowerCase().indexOf(model.toLowerCase()) !== -1 );
        else   
            files = uploadfiles.files;

        return res.status(200).json({
            status: 'success',
            data: {
                files,
            },
        });
    } catch (e) {
        console.log(e.message);
        return res.status(400).json({
            status: 'fail',
            message: e.message,
        });
    }
    return res.status(500).json({
        status: 'failed',
        message: 'internal server execption',
    });
};

const addFileUploadHandler = async (req, res) => {
    try {
        const {filename, mimetype} = req.file;
        const model = req.query.model;
        
        if (!model) { throw Error('model is not found'); }

        if (req.rval) {
            throw Error(req.rval);
        }
        let labels = [];

        if (!modelfile) {
            if (model === 'corn') {
                // model corn
                modelfile = await tf.loadLayersModel('file://' + path.join(__dirname, '..', 'models', 'corn-h5', 'model.json'));
                labels = labelcorn;
            }
            else if (model === 'potato') {
                // model potato
                modelfile = await tf.loadLayersModel('file://' + path.join(__dirname, '..', 'models', 'corn-h5', 'model.json'));
                labels = labelpotato;
            }
            else if (model === 'tomato') {
                 // model potato
                modelfile = await tf.loadLayersModel('file://' + path.join(__dirname, '..', 'models', 'corn-h5', 'model.json'));
                labels = labeltomato;
            } else {
                throw Error('model not found');
            }
        }
        console.log(labels);
        
        // image prediction goes here
        const clientimg = await getImage(path.join(__dirname, '..', 'client-img', model, filename));

        // predict image
        const predictions = await modelfile.predict(clientimg).dataSync();
        const prediction = Math.max(...predictions);
        let disease = labels[argMax(predictions)];
        if (!disease) {
            disease = 'undefined';
        }

        // add new entry
        const newFile = {
            filename: filename,
            mimetype: mimetype,
            model: model,
            url: 'http://' + hostname + ':5000' + '/download/' + model + '/' + filename,
            disease: disease,
            prediction: (prediction*100).toFixed(3),
        };
        uploadfiles.files.push(newFile);
        writeFile(uploadfiles);

        return res.status(200).json({
            status: 'success',
            filename: filename,
            model: model,
            url: 'http://' + hostname + ':5000' + '/download/' + model + '/' + filename,
            disease: disease,
            prediction: (prediction*100).toFixed(3),
        });
    } catch (e) {
        console.log(e.message);
        return res.status(400).json({
            status: 'fail',
            message: e.message,
        });
    }
    return res.status(500).json({
        status: 'failed',
        message: 'internal server execption',
    });
};


const deleteFileUploadHandler = (req, res) => {
    try {
        const model = req.query.model;
        if (!model) { throw Error ('model name required'); }
        const directory = path.join(__dirname, '..', 'client-img', model);
        fs.readdir(directory, (err, files) => {
            if (err) throw Error('files entry already cleared');

            for (const file of files) {
                if (file === '.gitkeep') continue;
                fs.unlink(path.join(directory, file), (err) => {
                    if (err) throw Error('files entry already cleared');
                });
            }
        });
        const index = uploadfiles.files.filter((n) => n.model === model)[0];
        if (index === undefined) throw Error('files entry already cleared');
        for( let i = 0; i < uploadfiles.files.length; i++){                  
            if ( uploadfiles.files[i].model === model) { 
                uploadfiles.files.splice(i, 1); 
                i--; 
            }
        }
        console.log('cleared!');
        writeFile(uploadfiles);

        return res.status(200).json({
            status: 'success',
            message: (model + ' data cleared'),
        });
    } catch (e) {
        console.log(e.message);
        return res.status(400).json({
            status: 'fail',
            message: e.message,
        });
    }
    return res.status(500).json({
        status: 'failed',
        message: 'internal server execption',
    });
};

module.exports = {getUploadHandler,
    addFileUploadHandler,
    deleteFileUploadHandler};
