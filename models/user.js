const config = require('config');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Joi = require('joi');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 5,
        maxlength: 50,
        required: true,
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024,
        unique: true
    },
    isAdmin: Boolean,
});
userSchema.methods.generateAuthToken = function () {
    return jwt.sign(
        {
            id: this._id,
            isAdmin: this.isAdmin,
        }, // payload. Could be anything what we need store and pass via token
        config.get('jwtPrivateKey') // secret key
    );
};

const User = mongoose.model('Users', userSchema);

const validateUser = (user) => {
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required() //joi-password-complexity
    };
    return Joi.validate(user, schema);
};

const hash = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

exports.hash = hash;
exports.User = User;
exports.validate = validateUser;
