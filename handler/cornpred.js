/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
/* eslint-disable no-unused-vars */
// Imports the Google Cloud client library.
const {Storage} = require('@google-cloud/storage');
const tf = require('@tensorflow/tfjs-node');

const path = require('path');
const {Image, createCanvas} = require('canvas');
const canvas = createCanvas(800, 600);
const ctx = canvas.getContext('2d');
let model = null;

const storage = new Storage();

const getCornHandler = async (req, res) => {
    try {
        console.log('Test backend!');
        res.send({anu: 'hehe'});
    } catch (e) {
        console.log(e);
        return res.send('error');
    }
};

const loadLocalImage = async (filename) => {
    try {
        const img = new Image();
        img.onload = () => ctx.drawImage(img, 0, 0);
        img.onerror = (err) => {
            throw err;
        };
        img.src = filename;
        image = tf.fromPixels(canvas);
        return image;
    } catch (err) {
        console.log(err);
    }
};

const getImage = async (filename) => {
    try {
        this.image = await loadLocalImage(filename);
    } catch (error) {
        console.log('error loading image', error);
    }
    return this.image;
};

const predictCornHandler = async (req, res) => {
    try {
        // load model
        if (!model) model = await tf.loadLayersModel('file://' + path.join(__dirname, '..', 'models', 'corn-h5', 'model.json'));
        const {model: modelName, img} = req.body;
        console.log('finished!');
        // const clientimg = await getImage('file://' + path.join(__dirname, '..', 'testing-img', 'testing.jpg'));
        // console.log(clientimg);
        return res.status(200).json({
            disease: 'anu',
            prediction: '999',
        });
    } catch (e) {
        console.log(e);
        return res.status(500).send('error');
    }
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

module.exports = {getCornHandler, predictCornHandler};
