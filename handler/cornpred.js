/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
/* eslint-disable no-unused-vars */
// Imports the Google Cloud client library.
const {Storage} = require('@google-cloud/storage');
const tf = require('@tensorflow/tfjs-node');

const path = require('path');
const Jimp = require('jimp');
let modelfile = null;
const storage = new Storage();

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
