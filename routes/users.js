const config = require('config');
const _ = require('lodash');
const {User, validate, hash} = require('../models/user');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');

router.get('/me', auth, async (req, res) => {
    const user = await User.findById(req.user.id)
        .select({password: false})
    // .select('-password')
        ;
    res.send(user);
});

router.post('/', async (req, res) => {
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details.slice().shift().message);
    let user = await User.findOne({email: req.body.email});
    if (user) return res.status(400).send('User already registered');
    user = new User(_.pick(req.body, ['name', 'email', 'password']));
    user.password = await hash(req.body.password);
    await user.save();
    const token = user.generateAuthToken();
    return res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
});

module.exports = router;
