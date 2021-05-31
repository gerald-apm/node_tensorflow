const files = require('../datahandler/upload');
const path = require('path');
const hostname = process.env.NODE_ENV !== 'production' ?
    'localhost' : '34.136.47.193';
const fs = require('fs');
const getUploadHandler = (req, res) => {
    try {
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

const addFileUploadHandler = (req, res) => {
    try {
        if (req.rval) {
            throw Error(req.rval);
        }
        const {filename, path} = req.file;
        // add new entry
        // TODO: Change localhost with external IP
        const newFile = {
            filename: filename,
            path: path,
            url: 'http://' + hostname + ':5000' + '/download/' + filename,
        };
        files.push(newFile);

        return res.status(200).json({
            status: 'success',
            filename: filename,
            path: path,
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
    const directory = path.join(__dirname, '..', 'client-img');
    try {
        fs.readdir(directory, (err, files) => {
            if (err) throw Error('files entry already cleared');

            for (const file of files) {
                fs.unlink(path.join(directory, file), (err) => {
                    if (err) throw Error('files entry already cleared');
                });
            }
        });
        if (files.length < 1) throw Error('files entry already cleared');
        files.splice(0, files.length);
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

module.exports = {getUploadHandler,
    addFileUploadHandler,
    deleteFileUploadHandler};
