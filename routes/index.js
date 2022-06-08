/* eslint-disable no-unused-vars */
/* eslint-disable new-cap */
const express = require('express');
const router = express.Router();
const getIndexHandler = require('../handler/index');

router.get('/', getIndexHandler);

module.exports = router;
