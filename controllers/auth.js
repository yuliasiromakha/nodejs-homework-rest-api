// controllers/auth
const { User } = require('../models/user');
const { schemas } = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { SECRET_KEY } = process.env;

const register = async (req, res) => {
    try {
        const { error } = schemas.registerSchema.validate(req.body);
        if (error) {
            console.error(error);
            return res.status(400).json({ message: error.message });
        }

        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user) {
            return res.status(409).json({ message: 'Email in use' });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({ ...req.body, password: hashPassword });

        res.status(201).json({
            email: newUser.email,
            name: newUser.name,
        });
    } catch (error) {
        console.error('Error in register:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const login = async (req, res) => {
    try {
        const { error } = schemas.loginSchema.validate(req.body);
        if (error) {
            console.error(error);
            return res.status(400).json({ message: error.message });
        }

        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Email or password is wrong' });
        }

        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            return res.status(401).json({ message: 'Email or password is wrong' });
        }

        const payload = {
            id: user._id,
        };

        const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '23h' });

        await User.findByIdAndUpdate(user._id, { token });

        res.json({
            token,
        });
    } catch (error) {
        console.error('Error in login:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getCurrent = async (req, res, next) => {
    const { email, name } = req.user;

    res.json({
        email,
        name,
    });
};

const logout = async (req, res, next) => {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: '' });

    res.json({
        message: 'Successful logout',
    });
};

module.exports = {
    register,
    login,
    getCurrent,
    logout,
};