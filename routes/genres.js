const express = require('express');
router = express.Router();
const Joi = require('joi');

let genres = [
    'Horror',
    'Action',
    'Comedy',
    'Drama',
    'History',
    'Documentary'
];

router.get('/', (req, res) => {
    return res.send(genres);
});

router.post('/', (req, res) => {
    const result = validateGenre(req.body);
    if (result.error) return res.status(400).send(result.error.details.slice().shift().message);
    genres.push(req.body.name);
    return res.send(genres);
});

router.put('/:id', (req, res) => {
    const result = validateGenre(req.body);
    if (result.error) return res.status(400).send(result.error.details.slice().shift().message);
    const id = +req.params.id;
    const genre = genres.find((g, index) => index === id);
    if (genre) {
       genres[id] = req.body.name;
        return res.send(genres);
    }
    return res.status(404).send(`genre for ${id} not found`);
});

router.delete('/:id', (req, res) => {
    const id = +req.params.id;
    if (id > 0 && genres.length >= id) {
        genres = genres.slice(id);
        return res.send(genres);
    }
    return res.status(404).send(`genre for ${id} not found`);
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
