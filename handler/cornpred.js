/* eslint-disable require-jsdoc */
/* eslint-disable no-unused-vars */
// Imports the Google Cloud client library.
const {Storage} = require('@google-cloud/storage');
const tf = require('@tensorflow/tfjs');
const path = require('path');
const cwd = path.join(__dirname, '../models/corn-h5/');

const storage = new Storage();

const getPotatoHandler = async (req, res) => {
    try {
        console.log('Test backend!');
        res.send({anu: 'hehe'});
    } catch (e) {
        console.log(e);
        return res.send('error');
    }
};

const predictPotatoHandler = async (req, res) => {

};

const downloadModel = async (
    bucketName = 'secret-imprint-312814-tf2-models',
    fileName = 'corn-h5/model_4.h5',
    destFileName = path.join(cwd, 'model_4.h5')) => {
    const options = {
        destination: destFileName,
    };

    // Downloads the file
    await storage.bucket(bucketName).file(fileName).download(options);

    console.log(
        `gs://${bucketName}/${fileName} downloaded to ${destFileName}.`,
    );
};

module.exports = {getPotatoHandler, predictPotatoHandler};
