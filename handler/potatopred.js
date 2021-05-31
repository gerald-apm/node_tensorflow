const tf = require('@tensorflow/tfjs-node');
const path = require('path');
const {getImage} = require('../utils/loadImage');
const {downloadModel} = require('../utils/downloadModels');
const potato =  require('../datahandler/potato');
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

const getPotatoHandler = (req, res) => {
    try {
        return res.status(200).json({
            status: 'success',
            data: {
                potato,
            },
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

const predictPotatoHandler = (req, res) => {
    try {
        return res.status(200).json({
            status: 'success',
            model: 'model',
            disease: 'disease',
            prediction: 'prediction',
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

const deletePotatoHandler = (req, res) => {
    try {
        if (potato.length < 1) throw Error('potato entry already cleared');
        potato.splice(0, corn.length);
        return res.status(200).json({
            status: 'success',
            message: 'all data cleared',
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

module.exports = {getPotatoHandler, predictPotatoHandler, deletePotatoHandler};
