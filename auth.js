const JWT = require('jsonwebtoken');
const JWT_SECRET = '7nEes5LyUBNV3fZLJpNr47WWPN4ddkQKYGmG3zEZXKrrENZtZc';

module.exports.createAccessToken = (user) => {
    const data = {
        id: user._id,
        email: user.email
    };

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const expiresIn = Math.floor((endOfDay.getTime() - Date.now()) / 1000);

    return JWT.sign(data, JWT_SECRET, { expiresIn });
};

module.exports.verify = (req, res, next) => {
    let token = req.headers.authorization;

    if (typeof token !== 'undefined') {
        token = token.slice(7, token.length);

        return JWT.verify(token, JWT_SECRET, (error, data) => {
            if (error) {
                return res.send({success: false, auth: error.message});
            }
            else {
                next();
            }
        });
    }
    else {
        return res.send({success: false, auth: 'Undefined token'});
    }
};

module.exports.decode = (token) => {
    if (typeof token !== 'undefined') {
        token = token.slice(7, token.length);

        return JWT.verify(token, JWT_SECRET, (error, data) => {
            if (error) {
                return null;
            }
            else {
                return JWT.decode(token, { complete: true }).payload;
            }
        });
    }
    else {
        return null;
    }
};