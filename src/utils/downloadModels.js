const {Storage} = require('@google-cloud/storage');
const storage = new Storage();

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

module.exports = {downloadModel};
