const logger = require('../middleware/logging.js');
const mongoose = require('mongoose');

module.exports = function () {
    mongoose.connect('mongodb://localhost/vidly', {useNewUrlParser: true})
        .then(() => {logger.log({level: 'info', message: 'Mongo db Connected', meta: ''});
    });
    mongoose.set('debug', true);
    mongoose.set('useCreateIndex', true);
};
