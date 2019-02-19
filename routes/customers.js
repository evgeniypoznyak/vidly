const express = require('express');
const router = express.Router();
const Joi = require('joi');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/vidly', {useNewUrlParser: true});
mongoose.set('debug', true);

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

const Customers = mongoose.model('Customers', customerSchema);

router.get('/', async (req, res) => {
    try {
        const customers = await Customers.find().select({name: 1}).sort({name: 1})
        return res.status(200).send(customers);
    }catch (e) {
        return res.status(400).send('No Customers to display');
    }
});

router.post('/', async (req, res) => {
    const result = validateCustomer(req.body);
    if (result.error) return res.status(400).send(result.error.details.slice().shift().message);
    try {
        const newCustomer = new Customers({
            isGold: req.body.isGold,
            name: req.body.name,
            phone: req.body.phone,
        });
        const result = newCustomer.save();
        return res.status(200).send(result);
    }catch (e) {
        return res.status(400).send('No Customers is been saved');
    }
});

router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const result = validateCustomer(req.body);
    if (result.error) return res.status(400).send(result.error.details.slice().shift().message);
    try {
        const updatedCustomer = await Customers.findOneAndUpdate({_id: id}, {
            name: req.body.name,
            phone: req.body.phone,
            isGold: req.body.isGold
        });
        return res.status(200).send(updatedCustomer);
    } catch (e) {
        return res.status(400).send('No Customers has been updated');
    }
});

router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const deletedCustomer = await Customers.findByIdAndDelete(id);
        return res.status(200).send({message: 'Customer has been deleted', customer: deletedCustomer});
    } catch (e) {
        return res.status(404).send(`Customer for ${id} not found`);
    }
});

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
    };
    return Joi.validate(customer, schema);
};

module.exports = router;
