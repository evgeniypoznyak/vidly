const mongoose = require('mongoose');
const Joi = require('joi');

const customerSchema = new mongoose.Schema({
    isGold: {
        type: Boolean,
        required: true,
    },
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 255
    },
    phone: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50
    }
});

const Customer = mongoose.model('Customers', customerSchema);

const validateCustomer = (customer) => {
    const schema = {
        isGold: Joi.boolean()
            .required(),
        name: Joi.string()
            .min(3)
            .max(255)
            .required(),
        phone: Joi.string()
            .min(2)
            .max(50)
            .required()
    };
    return Joi.validate(customer, schema);
};

exports.Customer = Customer;
exports.validate = validateCustomer;
