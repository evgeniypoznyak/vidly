const winston = require('winston');
require('winston-mongodb');
module.exports = winston.createLogger({
        // error
        // warn
        // info
        // verbose
        // debug
        // silly
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
        ),
        transports: [
            new winston.transports.Console(),
            new winston.transports.File({filename: 'logfile.log'}),
            new winston.transports.File({filename: 'error.log', level: 'error'}),
            new winston.transports.MongoDB({db: 'mongodb://localhost/vidly', level: 'error'})
        ],
        exceptionHandlers: [
            new winston.transports.Console(),
            new winston.transports.File({filename: 'exceptions.log'}),
            new winston.transports.MongoDB({db: 'mongodb://localhost/vidly', level: 'error'})
        ]
    }
);
