/* eslint-disable no-unused-vars */
/* eslint-disable new-cap */
const express = require('express');
const router = express.Router();
const {getCornHandler,
    predictCornHandler,
    deleteCornHandler,
} = require('../handler/cornpred');

router.get('/', getCornHandler);
router.post('/', predictCornHandler);
router.delete('/', deleteCornHandler);

module.exports = router;
