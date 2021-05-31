/* eslint-disable no-unused-vars */
/* eslint-disable new-cap */
const express = require('express');
const router = express.Router();

const {getTomatoHandler,
    predictTomatoHandler,
    deleteTomatoHandler
} = require('../handler/tomatopred');

router.get('/', getTomatoHandler);
router.post('/', predictTomatoHandler);
router.delete('/', deleteTomatoHandler);

module.exports = router;
