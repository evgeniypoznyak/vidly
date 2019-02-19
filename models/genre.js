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
const Genre = mongoose.model('Genres', genresSchema);

const validateGenre = (genre) => {
    const schema = {
        name: Joi.string()
            .min(3)
            .required()
    };
    return Joi.validate(genre, schema);
};

exports.Genre = Genre;
exports.validate = validateGenre;
