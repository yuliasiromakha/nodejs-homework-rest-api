const Contact = require('../models/contact');
const Joi = require("joi");

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
  try {
    const result = await Contact.find();
    console.log(result);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const add = async (req, res) => {
  const { error } = addSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }

  const result = await Contact.create(req.body);
  res.status(201).json(result);
};

const getContactById = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findById(id);
  if (!result) {
    res.status(404).json({ message: 'Not found' });
  }
  res.json(result);
};

const updateContact = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndUpdate(id, req.body, { new: true });

  if (!result) {
    res.status(404).json({ message: 'Not found' });
  }
  res.json(result);
};

const updateFavorite = async (req, res) => {
  const { id } = req.params;
  const { error } = updateFavoriteSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: 'missing field favorite' });
  }

  const result = await Contact.findByIdAndUpdate(id, { favorite: req.body.favorite }, { new: true });

  if (!result) {
    res.status(404).json({ message: 'Not found' });
  }
  res.json(result);
};

const deleteById = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndRemove(id);

  if (!result) {
    res.status(404).json({ message: 'Not found' });
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