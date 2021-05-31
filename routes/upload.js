/* eslint-disable no-unused-vars */
/* eslint-disable new-cap */
const express = require('express');
const router = express.Router();
const {getUploadHandler, addFileUploadHandler} = require('../handler/upload');

router.get('/', getUploadHandler);
router.post('/', addFileUploadHandler);

module.exports = router;
