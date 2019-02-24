const mongoose = require('mongoose');
const Joi = require('joi');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 2,
        maxlength: 255,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        // createIndexes: true,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
});
const User = mongoose.model('Users', userSchema);

const validateUser = (user) => {
    const schema = {
        name: Joi.string()
            .min(3)
            .required(),
        email: Joi.string()
            .required(),
        password: Joi.string()
            .required()
    };
    return Joi.validate(user, schema);
};

exports.User = User;
exports.userSchema = userSchema;
exports.validate = validateUser;
