const path = require("path");
const fs = require("fs").promises; 
const { nanoid } = require("nanoid"); 

const contactsPath = path.join(__dirname, './contacts.json');

const listContacts = async () => {
  return fs.readFile(contactsPath, "utf-8")
  .then(data => JSON.parse(data));
}

const getContactById = async (id) => {
  const contacts = await listContacts();
  const result = contacts.find(item => item.id === id)
  return result || null;
}

const removeContact = async (contactId) => {
  return listContacts()
        .then(contacts => {
            const index = contacts.findIndex(item => item.id === contactId);
            if (index === -1) {
                return null;
            }
            const [result] = contacts.splice(index, 1);
            return fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2))
                .then(() => result);
        });
}

// models/contacts.js
const addContact = async (name, email, phone) => {
  return listContacts()
    .then((contactsData) => {
      const newContact = {
        id: nanoid(),
        name: name,
        email: email,
        phone: phone,
      };
      contactsData.push(newContact);
      return fs.writeFile(contactsPath, JSON.stringify(contactsData, null, 2))
        .then(() => newContact); 
    });
};

const updateContact = async (contactId, body) => {
  return listContacts()
    .then(contacts => {
      const index = contacts.findIndex(item => item.id === contactId);
      if (index === -1) {
        return null; 
      }

      const updatedContact = {
        ...contacts[index],
        ...body,
        id: contactId, 
      };

      contacts[index] = updatedContact;

      return fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2))
        .then(() => updatedContact);
    });
}


module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
