const {Customer, validate} = require('../models/customer');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const customers = await Customer.find().select({name: 1}).sort({name: 1})
        return res.status(200).send(customers);
    }catch (e) {
        return res.status(400).send('No Customers to display');
    }
});

router.post('/', async (req, res) => {
    const result = validate(req.body);
    if (result.error) return res.status(400).send(result.error.details.slice().shift().message);
    try {
        const newCustomer = new Customer({
            isGold: req.body.isGold,
            name: req.body.name,
            phone: req.body.phone,
        });
        const result = await newCustomer.save();
        return res.status(200).send(result);
    }catch (e) {
        return res.status(400).send('No Customers is been saved');
    }
});

router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const result = validate(req.body);
    if (result.error) return res.status(400).send(result.error.details.slice().shift().message);
    try {
        const updatedCustomer = await Customer.findOneAndUpdate({_id: id}, {
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
        const deletedCustomer = await Customer.findByIdAndDelete(id);
        return res.status(200).send({message: 'Customer has been deleted', customer: deletedCustomer});
    } catch (e) {
        return res.status(404).send(`Customer for ${id} not found`);
    }
});

module.exports = router;
