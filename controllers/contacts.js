// controllers/contacts.js
const Contact = require('../models/contact');
const Joi = require('joi');

const addSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().required(),
    favorite: Joi.boolean(),
});

const updateFavoriteSchema = Joi.object({
    favorite: Joi.boolean().required(),
});

const getAll = async (req, res) => {
    const { _id: owner } = req.user;
    const { page = 1, limit = 10, favorite, name, email } = req.query;
    const skip = (page - 1) * limit;
    const query = { owner };

    if (favorite !== undefined) {
        query.favorite = favorite;
    }

    if (name) {
        query.name = { $regex: name, $options: 'i' };
    }

    if (email) {
        query.email = { $regex: email, $options: 'i' };
    }

    try {
        const contacts = await Contact.find(query)
            .skip(skip)
            .limit(limit)
            .populate('owner', 'name email');
        res.json(contacts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const add = async (req, res) => {
    const { _id: owner } = req.user;
    const { error } = addSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.message });
    }

    const result = await Contact.create({ ...req.body, owner });
    res.status(201).json(result);
};

const getContactById = async (req, res) => {
    const { id } = req.params;
    const contact = await Contact.findById(id);

    if (!contact || contact.owner.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Access forbidden' });
    }

    if (!contact) {
        res.status(404).json({ message: 'Not found' });
    }
    res.json(contact);
};

const updateContact = async (req, res) => {
    const { id } = req.params;
    const { _id: owner } = req.user;

    try {
        const updatedContact = await Contact.findOneAndUpdate(
            { _id: id, owner }, 
            req.body, 
            { new: true } 
        );

        if (!updatedContact) {
            return res.status(404).json({ message: 'Not found' });
        }

        res.json(updatedContact);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const updateFavorite = async (req, res) => {
    const { id } = req.params;
    const { error } = updateFavoriteSchema.validate(req.body);

    if (error) {
        return res.status(400).json({ message: 'missing field favorite' });
    }

    const contact = await Contact.findOneAndUpdate(
        { _id: id, owner: req.user._id },
        { favorite: req.body.favorite }, 
        { new: true } 
    );

    if (!contact) {
        res.status(404).json({ message: 'Not found' });
    }

    res.json(contact);
};

const deleteById = async (req, res) => {
    const { id } = req.params;
    const contact = await Contact.findOneAndRemove({ _id: id, owner: req.user._id });

    if (!contact) {
        return res.status(404).json({ message: 'Not found' });
    }

    res.json({ message: "Successfully deleted" });
};

module.exports = {
    getAll,
    add,
    getContactById,
    updateContact,
    deleteById,
    updateFavorite,
};