// controllers/auth
const { User } = require('../models/user');
const { schemas } = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const path = require('path');
const fs = require('fs/promises');
const Jimp = require('jimp');
const shortid = require('shortid');
const { sendEmail } = require('../helpers/sendEmail');

const { SECRET_KEY, BASE_URL } = process.env;
const avatarsDir = path.join(__dirname, '../', 'public', 'avatars');

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

    const avatarURL = gravatar.url(email);
    const verificationCode = shortid.generate();

    const newUser = await User.create({
      ...req.body,
      password: hashPassword,
      avatarURL,
      verificationToken: verificationCode, 
      verify: false, 
    });

    const verifyEmail = {
      to: email,
      subject: 'Verify email',
      html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${verificationCode}">Click to verify email</a>`,
    };

    await sendEmail(verifyEmail);

    res.status(201).json({
      email: newUser.email,
      name: newUser.name,
      avatarURL: newUser.avatarURL,
    });
  } catch (error) {
    console.error('Error in register:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.verify) {
      return res.status(400).json({ message: 'Email already verified' });
    }

    await User.updateOne(
      { _id: user._id },
      { verify: true, verificationToken: null }
    );

    res.status(200).json({
      message: 'Verification successful',
    });
  } catch (error) {
    console.error('Error in verifyEmail:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const resendVerifyEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.verify) {
      return res
        .status(400)
        .json({ message: 'Email has already been verified' });
    }

    const verifyEmail = {
      to: email,
      subject: 'Verify email',
      html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${user.verificationToken}">Click to verify email</a>`,
    };

    await sendEmail(verifyEmail);

    res.status(200).json({
      message: 'Verification email sent',
    });
  } catch (error) {
    console.error('Error in resendVerifyEmail:', error);
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

        if (!user.verify) {
            return res.status(401).json({ message: 'Email not verified' });
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

const updateAvatar = async (req, res, next) => {
    try {
        const { _id } = req.user;
        const { path: tempUpload, originalname } = req.file;
        const filename = `${_id}_${originalname}`;
        const resultUpload = path.join(avatarsDir, filename);

        const image = await Jimp.read(tempUpload);
        image.resize(250, 250).write(tempUpload);
    
        await fs.rename(tempUpload, resultUpload);
        const avatarURL = path.join('avatars', filename);
        await User.findByIdAndUpdate(_id, { avatarURL });
    
        // res.json({
        //     avatarURL,
        // });

        res.status(200).json({ avatarURL: avatarURL });

    } catch (error) {
    res.status(401).json({
        "message": "Not authorized"
      });
    }
};

module.exports = {
    register,
    verifyEmail,
    resendVerifyEmail,
    login,
    getCurrent,
    logout,
    updateAvatar,
};