/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
/* eslint-disable no-unused-vars */
const tf = require('@tensorflow/tfjs-node');
const path = require('path');
const {getImage} = require('../utils/loadImage');
const {downloadModel} = require('../utils/downloadModels');
const corn = require('../datahandler/corn');
const files = require('../datahandler/upload');
const hostname = process.env.NODE_ENV !== 'production' ?
    'localhost' : '34.136.47.193';

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

const getCornHandler = async (req, res) => {
    try {
        return res.status(200).json({
            status: 'success',
            data: {
                corn,
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

const predictCornHandler = async (req, res) => {
    try {
        // load model
        if (!modelfile) modelfile = await tf.loadLayersModel('file://' + path.join(__dirname, '..', 'models', 'corn-h5', 'model.json'));
        const {model, img} = req.body;
        // error thrower
        if (!img) throw Error('harus menampilkan url gambar!');
        if (!model) throw Error('harus menambahkan nama gambar');

        const index = files.findIndex((n) => n.filename === img);
        if (!index) throw Error('gambar tidak ditemukan');

        console.log('finished!');
        // const clientimg = await getImage(path.join(__dirname, '..', 'testing-image', 'testing.jpg'));
        // fetch from random url
        const clientimg = await getImage(path.join(__dirname, '..', 'client-img', img));

        console.log(clientimg);
        // predict image
        const predictions = await modelfile.predict(clientimg).dataSync();
        const prediction = Math.max(...predictions);
        const disease = labels[argMax(predictions)];
        const url = 'http://' + hostname + ':5000' + '/download/' + img;

        const newCorn = {
            model: model,
            imagePath: img,
            imageUrl: url,
            disease: disease,
            prediction: prediction.toFixed(3),

        };
        corn.push(newCorn);

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

const deleteCornHandler = async (req, res) => {
    try {
        if (corn.length < 1) throw Error('corn entry already cleared');
        corn.splice(0, corn.length);
        return res.status(200).json({
            status: 'success',
            message: 'all data cleared',
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

module.exports = {getCornHandler, predictCornHandler, deleteCornHandler};
