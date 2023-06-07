const jwt = require('jsonwebtoken');
const config = require('../config/auth.config.js');

verifyToken = (req, res, next) => {
    let token = req.session.token;

    if (!token) {
        return res.status(403).send('No token provided!');
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send('Unauthorized!');
        }
        req.userId = decoded.id;
        next();
    });
};

module.exports = { verifyToken } ;