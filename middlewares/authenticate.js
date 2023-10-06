// middlewares/authenticate.js
const jwt = require('jsonwebtoken');
const { User } = require('../models/user');
const { Contact } = require('../models/contact'); 

const { SECRET_KEY } = process.env;

const authenticate = async (req, res, next) => {
    const { authorization = '' } = req.headers;
    const [bearer, token] = authorization.split(' ');

    if (bearer !== 'Bearer') {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const { id } = jwt.verify(token, SECRET_KEY);
        const user = await User.findById(id);

        if (!user || !user.token || user.token !== token) {
            return res.status(404).json({ message: 'User not found' });
        }

        req.user = user;

        if (req.params.id) {
            const contact = await Contact.findById(req.params.id);
            if (!contact || contact.owner.toString() !== user._id.toString()) {
                return res.status(403).json({ message: 'Access forbidden' });
            }
        }

        next();
    } catch (error) {
        console.error('Error in authenticate middleware:', error);
        return res.status(401).json({ message: 'Unauthorized' });
    }
};

module.exports = { authenticate };