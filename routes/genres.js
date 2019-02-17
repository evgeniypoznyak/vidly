const express = require('express');
const router = express.Router();
const Joi = require('joi');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/vidly', {useNewUrlParser: true});
mongoose.set('debug', true);

const genresSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
});
const Genres = mongoose.model('Genres', genresSchema);

router.get('/', async (req, res) => {
    try {
        const genres = await Genres.find().select({name: 1}).sort({name: 1});
        return res.send(genres);
    } catch (e) {
        return res.status(400).send('No Genres to display');
    }
});

router.post('/', async (req, res) => {
    const result = validateGenre(req.body);
    if (result.error) return res.status(400).send(result.error.details.slice().shift().message);
    try {
        const newGenre = new Genres({name: req.body.name});
        const result = await newGenre.save();
        return res.status(200).send(result);
    } catch (e) {
        return res.status(400).send('No Genres is been saved');
    }
});

router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const result = validateGenre(req.body);
    if (result.error) return res.status(400).send(result.error.details.slice().shift().message);
    try {
        const updatedGenre = await Genres.findOneAndUpdate({_id: id}, {name: req.body.name});
        return res.status(200).send(updatedGenre);
    } catch (e) {
        return res.status(400).send('No Genres has been updated');
    }
});

router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const deletedGenre = await Genres.findByIdAndDelete(id);
        return res.status(200).send({message: 'Genre has been deleted', genre: deletedGenre});
    } catch (e) {
        return res.status(404).send(`genre for ${id} not found`);
    }
});

const validateGenre = (genre) => {
    const schema = {
        name: Joi.string()
            .min(3)
            .required()
    };
    return Joi.validate(genre, schema);
};

module.exports = router;
