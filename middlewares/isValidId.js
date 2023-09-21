// isValidId.js
const { isValidObjectId } = require("mongoose");

const isValidId = (req, res, next) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
        return res.status(400).json({ message: `${id} is not a valid id` });
    }
    next();
}

module.exports = { isValidId };
