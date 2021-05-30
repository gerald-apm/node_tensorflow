/* eslint-disable max-len */
const tf = require('@tensorflow/tfjs-node');
const Jimp = require('jimp');
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

module.exports = {getImage};
