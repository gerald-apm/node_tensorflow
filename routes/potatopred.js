/* eslint-disable no-unused-vars */
/* eslint-disable new-cap */
const express = require('express');
const router = express.Router();

const {getPotatoHandler,
    predictPotatoHandler,
    deletePotatoHandler
} = require('../handler/potatopred');

router.get('/', getPotatoHandler);
router.post('/', predictPotatoHandler);
router.delete('/', deletePotatoHandler);

module.exports = router;
