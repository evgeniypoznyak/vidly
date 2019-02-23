const express = require('express');
const app = express();
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/vidly', {useNewUrlParser: true});
mongoose.set('debug', true);
const genres = require('./routes/genres');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const customers = require('./routes/customers');
const home = require('./routes/home');

app.use(express.json());
app.use('/', home);
app.use('/api/genres', genres);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/customers', customers);


const port = process.env.PORT || 3000;
const host = process.env.HOST || 'http://localhost';
app.listen(port, () => console.log(`Listening: ${host}:${port}`));
