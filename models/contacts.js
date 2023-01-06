const { Contact } = require("../db/contactModel");

const listContacts = async () => {
  const result = await Contact.find({});
  return result;
};

const getContactById = async (contactId) => {
  const result = await Contact.findById(contactId);
  return result;
};

const removeContact = async (contactId) => {
  await Contact.deleteOne({ _id: contactId });
  return contactId;
};

const addContact = async (body) => {
  const contact = new Contact(body);
  const result = await contact.save().catch((err) => {
    return { error: err };
  });
  return result;
};

const updateContact = async (contactId, body) => {
  const { name, email, phone } = body;
  await Contact.findByIdAndUpdate(contactId, {
    $set: { name, email, phone },
  });
  const result = await Contact.findById(contactId);
  return result;
};

const updateStatusContact = async (contactId, body) => {
  const { favorite } = body;
  try {await Contact.findByIdAndUpdate(contactId, { favorite }
    )}
  catch(err) {
    return { error: err };
  };
  const result = await Contact.findById(contactId);
  return result;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact
};
