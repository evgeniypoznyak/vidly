const logger = require('../middleware/logging');

module.exports = function (err, req, res, next) { // must be after all routes and middleware(s)
    // error
    // warn
    // info
    // verbose
    // debug
    // silly

    logger.log({
        level: 'error',
        message: err.message,
        meta: err
    });

    // logger.log({
    //     level: 'info',
    //     message: err.message + 'DEBUG!!!',
    //     meta: err
    // });

    return res.status(500) // internal server error
        .send('Something failed');
};
