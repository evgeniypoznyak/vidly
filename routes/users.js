const _ = require('lodash');
const {User, validate, hash} = require('../models/user');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details.slice().shift().message);
    let user = await User.findOne({email: req.body.email});
    if (user) return res.status(400).send('User already registered');
    user = new User(_.pick(req.body, ['name', 'email', 'password']));
    user.password = await hash(req.body.password);
    await user.save();
    return res.send(_.pick(user, ['_id','name', 'email']));
});

module.exports = router;
