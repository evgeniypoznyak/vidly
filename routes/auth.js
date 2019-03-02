const config = require('config');
const _ = require('lodash');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const {User} = require('../models/user');
const Joi = require('joi');
const bcrypt = require('bcrypt');

router.post('/', async (req, res) => {
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details.slice().shift().message);

    let user = await User.findOne({email: req.body.email});
    if (!user) return res.status(400).send('Invalid email or password!');

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Invalid email or password.');

    const token = user.generateAuthToken();
    return res.header('x-auth-token', token).send(_.pick(user, ['_id','name', 'email']));
});

const validate = async (req) => {
    const schema = {
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required() //joi-password-complexity
    };
    return Joi.validate(req, schema);
};

module.exports = router;
