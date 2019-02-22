const express = require('express');
const Movie = require('../models/movie').Movie;
const Customer = require('../models/customer').Customer;
const router = express.Router();
const {Rental, validate} = require('../models/rental');


router.get('/', async (req, res) => {
    try {
        const rentals = await Rental.find().sort({dateOut: -1});
        return res.send(rentals);
    }catch (e) {
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
        if(!movie) return res.status(400).send('Invalid Movie');

        if(movie.numberInStock === 0) return res.status(400).send('Movie not available for rent');

        let rental = new Rental({
            customer: {
                _id: customer._id,
                name: customer.name,
                phone: customer.phone
            },
            movie: {
                title: movie.title,
                dailyRentalRate: 2
            },

        });

    }catch (e) {
        return res.status(404).send('Something went wrong')
    }
});


module.exports = router;
