const express = require('express');
const router = express.Router();
const Fawn = require('fawn');
const mongoose = require('mongoose');
const {Movie} = require('../models/movie');
const {Customer} = require('../models/customer');
const {Rental, validate} = require('../models/rental');
Fawn.init(mongoose);

router.get('/', async (req, res) => {
    try {
        const rentals = await Rental.find().sort({dateOut: -1});
        return res.send(rentals);
    } catch (e) {
        return res.status(400).send('No rentals to display');
    }

});

router.post('/', async (req, res) => {
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details.slice().shift().message);

    try {
        const customer = await Customer.findById(req.body.customerId);
        if (!customer) return res.status(400).send('Invalid Customer');

        const movie = await Movie.findById(req.body.movieId);
        if (!movie) return res.status(400).send('Invalid Movie');

        if (movie.numberInStock === 0) return res.status(400).send('Movie not available for rent');

        let rental = new Rental({
            customer: {
                _id: customer._id,
                name: customer.name,
                phone: customer.phone,
                // isGold: customer.isGold
            },
            movie: {
                _id: movie._id,
                title: movie.title,
                dailyRentalRate: movie.dailyRentalRate,
            },
        });
        /*
        rental = await rental.save();
        movie.numberInStock--;
        movie.save();
        */
        try {
            new Fawn.Task()
                .save('rentals', rental)
                .update('movies', {_id: movie._id}, {
                    $inc: {numberInStock: -1}
                })
                .run();
            res.status(200).send(rental);
        }catch (e) {
            return res.status(500).send('Movie or rentals cannot be updated');
        }

    } catch (e) {
        return res.status(400).send('Something went wrong')
    }
});


module.exports = router;
