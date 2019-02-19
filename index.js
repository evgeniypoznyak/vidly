const express = require('express');
const app = express();
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const home = require('./routes/home');

app.use(express.json());
app.use('/', home);
app.use('/api/genres', genres);
app.use('/api/customers', customers);



const port = process.env.PORT || 3000;
const host = process.env.HOST || 'http://localhost';
app.listen(port, () => console.log(`Listening: ${host}:${port}`));
