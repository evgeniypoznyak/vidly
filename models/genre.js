const Joi = require('joi');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/vidly', {useNewUrlParser: true});
mongoose.set('debug', true);

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
});
const Genre = mongoose.model('Genres', genreSchema);

const validateGenre = (genre) => {
    const schema = {
        name: Joi.string()
            .min(3)
            .required()
    };
    return Joi.validate(genre, schema);
};

exports.Genre = Genre;
exports.genreSchema = genreSchema;
exports.validate = validateGenre;
