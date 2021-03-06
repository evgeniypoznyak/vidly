const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const {Genre} = require('../models/genre');
const {Movie, validate} = require('../models/movie');

router.get('/', async (req, res) => {
    try {
        const movies = await Movie.find();
        return res.send(movies);
    } catch (e) {
        return res.status(400).send('No movies to display');
    }
});

router.post('/', auth, async (req, res) => {
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details.slice().shift().message);
    let genre = undefined;
    try {
        genre = await Genre.findById(req.body.genreId);
    }catch (e) {
        return res.status(400).send('Invalid genre id');
    }
    if (!genre) return res.status(400).send('Invalid genre');
    try {
        const movie = new Movie({
            title: req.body.title,
            genre: {
                _id: genre._id,
                name: genre.name,
            },
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate
        });
        await movie.save();
        res.status(200).send(movie);
    } catch (e) {
        return res.status(400).send('No movies has been saved');
    }
});

router.delete(':id', auth, async (req, res) => {
    const id = req.params.id;
    try {
        const result = await Movie.findByIdAndDelete(id);
        if (result) return res.status(200).send(result);
        return res.status(400).send(`No movies has been found for provided id: ${id}`);
    } catch (e) {
        return res.status(400).send('No movies has been deleted')
    }
});

router.put(':id', auth, async (req, res) => {
    const id = req.params.id;
    try {
        const {error} = validate(req.body);
        if (error) return res.status(400).send(error.details.slice().shift().message);
        const genre = await Genre.findById(req.body.genreId);
        if (!genre) return res.status(400).send('Invalid genre');
        const updatedMovie = await Movie.findOneAndUpdate({_id: id}, {
            title: req.body.title,
            genre: {
                _id: genre._id,
                name: genre.name,
            },
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate
        });
        return res.status(200).send(updatedMovie)
    } catch (e) {
        return res.status(400).send('No movies has been updated')
    }
});

module.exports = router;
