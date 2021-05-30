/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
/* eslint-disable no-unused-vars */
// Imports the Google Cloud client library.
const {Storage} = require('@google-cloud/storage');
const tf = require('@tensorflow/tfjs-node');

const path = require('path');
const Jimp = require('jimp');
let model = null;
const storage = new Storage();

const labels = [
    'healthy',
    'common rust',
    'northern leaf blight',
    'cercospora leaf spot',
];

const argMax = (array) => {
    return array.map((x, i) => [x, i]).reduce((r, a) => (a[0] > r[0] ? a : r))[1];
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

const loadLocalImage = async (filename) => {
    try {
        const image = await Jimp.read(filename);
        image.cover(224, 224, Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE);

        const NUM_OF_CHANNELS = 3;
        const values = new Float32Array(224 * 224 * NUM_OF_CHANNELS);

        let i = 0;
        image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
            const pixel = Jimp.intToRGBA(image.getPixelColor(x, y));
            pixel.r = pixel.r / 127.0 - 1;
            pixel.g = pixel.g / 127.0 - 1;
            pixel.b = pixel.b / 127.0 - 1;
            pixel.a = pixel.a / 127.0 - 1;
            values[i * NUM_OF_CHANNELS + 0] = pixel.r;
            values[i * NUM_OF_CHANNELS + 1] = pixel.g;
            values[i * NUM_OF_CHANNELS + 2] = pixel.b;
            i++;
        });

        const outShape = [224, 224, NUM_OF_CHANNELS];
        let imgTensor = tf.tensor3d(values, outShape, 'float32');
        imgTensor = imgTensor.expandDims(0);

        return imgTensor;
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
        const clientimg = await getImage(path.join(__dirname, '..', 'testing-image', 'testing.jpg'));
        console.log(clientimg);
        // predict image
        const predictions = await model.predict(clientimg).dataSync();
        for (let i = 0; i < predictions.length; i++) {
            const label = labels[i];
            const probability = predictions[i];
            console.log(`${label}: ${probability}`);
        }
        return res.status(200).json({
            disease: labels[argMax(predictions)],
            prediction: Math.max(...predictions),
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
