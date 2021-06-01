/* eslint-disable max-len */
const tf = require('@tensorflow/tfjs-node');
const {getImage} = require('../utils/loadImage');
const {writeFile, readFile} = require('../datahandler/upload');
const path = require('path');
const hostname = require('../utils/localhost');
const fs = require('fs');
let modelfile = null;

const labels = [
    'healthy',
    'common rust',
    'northern leaf blight',
    'cercospora leaf spot',
];

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
        if (!modelfile) modelfile = await tf.loadLayersModel('file://' + path.join(__dirname, '..', 'models', 'corn-h5', 'model.json'));
        if (req.rval) {
            throw Error(req.rval);
        }
        const {filename, mimetype} = req.file;
        const model = req.query.model;
        console.log(model);
        if (!model) { throw Error('model not found'); }

        // image prediction goes here
        const clientimg = await getImage(path.join(__dirname, '..', 'client-img', model, filename));

        console.log(clientimg);
        // predict image
        const predictions = await modelfile.predict(clientimg).dataSync();
        const prediction = Math.max(...predictions);
        const disease = labels[argMax(predictions)];

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

const predictCornHandler = async (req, res) => {
    try {
        // load model
        // TODO: load model from different plants
        if (!modelfile) modelfile = await tf.loadLayersModel('file://' + path.join(__dirname, '..', 'models', 'corn-h5', 'model.json'));
        const {model, img} = req.body;
        // error thrower
        if (!img) throw Error('harus menampilkan url gambar!');
        if (!model) throw Error('harus menambahkan nama gambar');
        const uploadfiles = readUploadFile();
        const files = uploadfiles.files;
        const index = files.filter((n) => n.filename === img)[0];
        if (index === undefined) throw Error('gambar tidak ditemukan');

        // const clientimg = await getImage(path.join(__dirname, '..', 'testing-image', 'testing.jpg'));
        // fetch from random url
        const clientimg = await getImage(path.join(__dirname, '..', 'client-img', img));

        console.log(clientimg);
        // predict image
        const predictions = await modelfile.predict(clientimg).dataSync();
        const prediction = Math.max(...predictions);
        const disease = labels[argMax(predictions)];
        const url = 'http://' + hostname + ':5000' + '/download/' + model + '/' + img;

        const newCorn = {
            model: model,
            imageName: img,
            imageUrl: url,
            disease: disease,
            prediction: prediction.toFixed(3),

        };
        corndata.corn.push(newCorn);
        writeFile(corndata);
        for (let i = 0; i < predictions.length; i++) {
            const label = labels[i];
            const probability = predictions[i];
            console.log(`${label}: ${probability}`);
        }

        return res.status(200).json({
            status: 'success',
            model: model,
            disease: disease,
            prediction: `${(prediction * 100).toFixed(3)}%`,
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
