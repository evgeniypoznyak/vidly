require('express-async-errors');
const config = require('config');
const express = require('express');
const app = express();
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/vidly', {useNewUrlParser: true});
mongoose.set('debug', true);
mongoose.set('useCreateIndex', true);
const genres = require('./routes/genres');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const customers = require('./routes/customers');
const auth = require('./routes/auth');
const users = require('./routes/users');
const home = require('./routes/home');
const logger = require('./middleware/logging');
const error = require('./middleware/error');

process.on('uncaughtException', (ex) => {
    logger.log({
        level: 'error',
        message: ex.message,
        meta: ex
    });
});

// throw new Error('poop');


if (!config.get('jwtPrivateKey')){
    console.error('FATAL ERROR: jwtPrivateKey is not defined!');
    process.exit(1);
}

app.use(express.json());
app.use('/', home);
app.use('/api/genres', genres);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/customers', customers);
app.use('/api/auth', auth);
app.use('/api/users', users);
app.use(error); // must be after all routes and middleware(s)

const port = process.env.PORT || 3000;
const host = process.env.HOST || 'http://localhost';
app.listen(port, () => console.log(`Listening: ${host}:${port}`));
