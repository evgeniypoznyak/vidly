const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const asyncMiddleware = require('../middleware/async');
const {Genre, validate} = require('../models/genre');

router.get('/', async (req, res) => {
    // throw new Error('Oups!');
    const genres = await Genre.find().select({name: 1}).sort({name: 1});
    return res.send(genres);
});

router.post('/', auth, asyncMiddleware(async (req, res) => {
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details.slice().shift().message);
    let genre = await Genre.findOne({name: req.body.name});
    if (genre) return res.status(400).send('Genre already exist');
    genre = new Genre({name: req.body.name});
    await genre.save();
    return res.status(200).send(genre);
}));

router.put('/:id', auth, asyncMiddleware(async (req, res) => {
    const id = req.params.id;
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details.slice().shift().message);
    const updatedGenre = await Genre.findOneAndUpdate({_id: id}, {name: req.body.name});
    return res.status(200).send(updatedGenre);
}));

router.delete('/:id', [auth, admin], asyncMiddleware(async (req, res) => {
    const id = req.params.id;
    const deletedGenre = await Genre.findByIdAndDelete(id);
    return res.status(200).send({message: 'Genre has been deleted', genre: deletedGenre});
}));

module.exports = router;
