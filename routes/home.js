const express = require('express');
router = express.Router();

router.get('/', (req, res) => {
    return res.send('Hello World!');
});

module.exports = router;
