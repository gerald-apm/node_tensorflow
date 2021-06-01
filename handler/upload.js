/* eslint-disable max-len */
const {writeFile, readFile} = require('../datahandler/upload');
const path = require('path');
const hostname = process.env.NODE_ENV !== 'production' ?
    'localhost' : '35.188.36.119';
const fs = require('fs');
const { diffieHellman } = require('crypto');
let uploadfiles = {
    files: [],
};

const getUploadHandler = (req, res) => {
    try {
        uploadfiles = readFile();
        const files = uploadfiles.files;
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
        const {filename, mimetype} = req.file;
        const model = req.query.model;
        console.log(model);
        if (!model) { throw Error('model not found'); }
        // add new entry
        // TODO: Change localhost with external IP
        const newFile = {
            filename: filename,
            mimetype: mimetype,
            model: model,
            url: 'http://' + hostname + ':5000' + '/download/' + model + '/' + filename,
        };
        uploadfiles.files.push(newFile);
        writeFile(uploadfiles);

        return res.status(200).json({
            status: 'success',
            filename: filename,
            model: model,
            url: 'http://' + hostname + ':5000' + '/download/' + model + '/' + filename,
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
    try {
        const model = req.query.model;
        if (!model) { throw Error ('model name required'); }
        const directory = path.join(__dirname, '..', 'client-img', model);
        fs.readdir(directory, (err, files) => {
            if (err) throw Error('files entry already cleared');

            for (const file of files) {
                if (file === '.gitkeep') continue;
                fs.unlink(path.join(directory, file), (err) => {
                    if (err) throw Error('files entry already cleared');
                });
            }
        });
        const index = uploadfiles.files.filter((n) => n.model === model)[0];
        if (index === undefined) throw Error('files entry already cleared');
        for( let i = 0; i < uploadfiles.files.length; i++){                  
            if ( uploadfiles.files.length === model) { 
                uploadfiles.files.splice(i, 1); 
                i--; 
            }
        }
        writeFile(uploadfiles);

        return res.status(200).json({
            status: 'success',
            message: (model + ' data cleared'),
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
