const config = require('config');
const jwt = require('jsonwebtoken');


module.exports = function (req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401) // Unauthorized
        .send('Access denied. No token provided');
    try {
        const decodedPayload = jwt
            .verify(token, config.get('jwtPrivateKey')); // if its valid it will be decoded and return payload
        req.user = decodedPayload;
        next();
    }catch (e) {
        return res.status(400) // Bad request
            .send('Invalid token');
    }

};

// module.exports = auth;
