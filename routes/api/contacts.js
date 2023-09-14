const express = require('express');
const contacts = require('../../models/contacts');
const Joi = require('joi')

const router = express.Router();

const addSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
})

router.get('/', async (req, res, next) => {
  try {
    const result = await contacts.listContacts();
    res.json(result);
  } catch (error) {
    next(error); 
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    console.log(req.body);
    const { id } = req.params;
    const result = await contacts.getContactById(id);
    if (!result) {
      res.status(404).json({ message: 'Not found' });
    } else {
      res.json(result);
    }
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    console.log(req.body);
    const { error } = addSchema.validate(req.body)
    console.log(error);
    if (error) {
      res.status(400).json({ message: error.message }); 
    } else {
      const { name, email, phone } = req.body;
      const result = await contacts.addContact(name, email, phone);
      res.status(201).json(result);
    }
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await contacts.removeContact(id);

    if (!result) {
      res.status(404).json({ message: 'Not found' });
    } 

    res.json({
      message: "contact deleted"
    })

  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { error } = addSchema.validate(req.body);
    if (error) {
      res.status(400).json({ message: error.message }); 
    } 
      
    const { id } = req.params;
    const result = await contacts.updateContact(id, req.body);
      if (!result) {
        res.status(404).json({ message: 'Not found' }); 
      } 
    res.json(result);
  
  } catch (error) {
    next(error);
  }
});

module.exports = router;
