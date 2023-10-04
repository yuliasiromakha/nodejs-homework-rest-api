// routes/api/auth
const express = require('express');
const cntrl = require("../../controllers/auth")
const {authenticate} = require('../../middlewares/authenticate');

const router = express.Router();

router.post('/register', cntrl.register)
router.post('/login', cntrl.login)

router.get('/current', authenticate, cntrl.getCurrent)

router.post('/logout', authenticate, cntrl.logout)

module.exports = router;