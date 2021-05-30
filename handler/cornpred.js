/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
/* eslint-disable no-unused-vars */
const tf = require('@tensorflow/tfjs-node');
const path = require('path');
const {getImage} = require('../utils/loadImage');
const {downloadModel} = require('..utils/dowloadModels');
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
        console.log('Test backend!');
        res.send({anu: 'hehe'});
    } catch (e) {
        console.log(e);
        return res.send('error');
    }
};

const predictCornHandler = async (req, res) => {
    try {
        // load model
        if (!modelfile) modelfile = await tf.loadLayersModel('file://' + path.join(__dirname, '..', 'models', 'corn-h5', 'model.json'));
        const {model, img} = req.body;
        // error thrower
        if (!img) throw Error('harus menampilkan url gambar!');
        if (!model) throw Error('harus menambahkan nama gambar');

        console.log('finished!');
        // const clientimg = await getImage(path.join(__dirname, '..', 'testing-image', 'testing.jpg'));
        // fetch from random url
        const clientimg = await getImage(img);

        console.log(clientimg);
        // predict image
        const predictions = await modelfile.predict(clientimg).dataSync();
        for (let i = 0; i < predictions.length; i++) {
            const label = labels[i];
            const probability = predictions[i];
            console.log(`${label}: ${probability}`);
        }
        return res.status(200).json({
            status: 'success',
            model: model,
            disease: labels[argMax(predictions)],
            prediction: Math.max(...predictions),
        });
    } catch (e) {
        console.log(e);
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

module.exports = {getCornHandler, predictCornHandler};
