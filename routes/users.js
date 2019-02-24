const {User, validate} = require('../models/users');
const express = require('express');
const router = express.Router();


router.post('/', async (req, res) => {
    return res.send('TEST');
});

module.exports = router;
