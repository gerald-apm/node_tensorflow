/* eslint-disable no-unused-vars */
/* eslint-disable new-cap */
const express = require('express');
const router = express.Router();
const {getPotatoHandler,
    predictPotatoHandler,
} = require('../handler/cornpred');

router.get('/', getPotatoHandler);
router.get('/', predictPotatoHandler);

module.exports = router;
