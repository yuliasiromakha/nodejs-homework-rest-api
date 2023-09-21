// api/contacts.js
const express = require('express');
const cntrl = require("../../controllers/contacts")
const router = express.Router();

const {isValidId} = require('../../middlewares/isValidId')

router.get('/', cntrl.getAll);
router.post('/', cntrl.add);  
router.get('/:id', isValidId, cntrl.getContactById)
router.put('/:id', isValidId, cntrl.updateContact)
router.delete('/:id', isValidId, cntrl.deleteById)
router.patch('/:id', isValidId, cntrl.updateFavorite)

module.exports = router;