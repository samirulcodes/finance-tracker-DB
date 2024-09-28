const jwt = require('jsonwebtoken');
const User = require('./models/User');

const authenticate = (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    User.findOne({ _id: decoded._id }).then((user) => {
        if (!user) throw new Error();
        req.user = user;
        next();
    }).catch(err => res.status(401).send({ error: 'Unauthorized' }));
};

module.exports = { authenticate };
