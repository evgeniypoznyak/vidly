const express = require('express');
const app = express();
const genres = require('./routes/genres');

app.use('/api/genres', genres);
