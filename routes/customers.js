const {Customer, validate} = require('../models/customer');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');


router.get('/', async (req, res) => {
    try {
        const customers = await Customer.find().select({name: 1}).sort({name: 1})
        return res.status(200).send(customers);
    }catch (e) {
        return res.status(400).send('No Customers to display');
    }
});

router.post('/', auth, async (req, res) => {
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details.slice().shift().message);
    try {
        const newCustomer = new Customer({
            isGold: req.body.isGold,
            name: req.body.name,
            phone: req.body.phone,
        });
        await newCustomer.save();
        return res.status(200).send(newCustomer);
    }catch (e) {
        return res.status(400).send('No Customers is been saved');
    }
});

router.put('/:id', auth, async (req, res) => {
    const id = req.params.id;
    const {result} = validate(req.body);
    if (error) return res.status(400).send(error.details.slice().shift().message);
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

router.delete('/:id', auth,  async (req, res) => {
    const id = req.params.id;
    try {
        const deletedCustomer = await Customer.findByIdAndDelete(id);
        return res.status(200).send({message: 'Customer has been deleted', customer: deletedCustomer});
    } catch (e) {
        return res.status(404).send(`Customer for ${id} not found`);
    }
});

module.exports = router;
