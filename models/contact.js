// models/contacts.js
const {Schema, model} = require("mongoose");

const contactsSchema = new Schema({
  name: {
    type: String,
    required: [true, `Set name for contact`],
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
})

contactsSchema.post("save", (error, data, next) => {
    error.status = 400;
    console.log(error);
    next();
})

const Contact = model("contact", contactsSchema);

module.exports = Contact;