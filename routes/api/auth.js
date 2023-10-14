// routes/api/auth
const express = require('express');
const cntrl = require("../../controllers/auth")
const {authenticate} = require('../../middlewares/authenticate');
const {upload} = require('../../middlewares/upload');

const router = express.Router();

router.post('/register', cntrl.register);
router.get('/verify/:verificationToken', cntrl.verifyEmail); 
router.post('/verify', cntrl.resendVerifyEmail);

router.post('/login', cntrl.login);

router.get('/current', authenticate, cntrl.getCurrent);

router.post('/logout', authenticate, cntrl.logout);

router.patch('/avatars', authenticate, upload.single('avatar'), cntrl.updateAvatar);

module.exports = router;