// routes/api/contacts.js
const express = require('express');
const cntrl = require('../../controllers/contacts');
const router = express.Router();

const { isValidId } = require('../../middlewares/isValidId');
const { authenticate } = require('../../middlewares/authenticate');

router.get('/', authenticate, cntrl.getAll);
router.post('/', authenticate, cntrl.add);
router.get('/:id', authenticate, isValidId, cntrl.getContactById);
router.put('/:id', authenticate, isValidId, cntrl.updateContact);
router.delete('/:id', authenticate, isValidId, cntrl.deleteById);
router.patch('/:id', authenticate, isValidId, cntrl.updateFavorite);

module.exports = router;