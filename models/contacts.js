const { Contact } = require("../db/contactModel");

const listContacts = async (userId, { page, limit, favorite }) => {
  const skip = (page - 1) * limit;
  if(!favorite) {
    const result = await Contact.find({ owner: userId })
    .select({ __v: 0 })
    .skip(skip)
    .limit(limit);
  return result;
  }
  const result = await Contact.find({ owner: userId , favorite})
    .select({ __v: 0 })
    .skip(skip)
    .limit(limit);
  return result;
  
};

const getContactById = async (contactId, userId) => {
  const result = await Contact.findOne({ _id: contactId, owner: userId });
  return result;
};

const removeContact = async (contactId, userId) => {
  await Contact.deleteOne({ _id: contactId, owner: userId });
  return contactId;
};

const addContact = async (body, userId) => {
  console.log("userId", userId);
  const newContact = { ...body, owner: userId };
  const contact = new Contact(newContact);
  const result = await contact.save().catch((err) => {
    return { error: err };
  });
  return result;
};

const updateContact = async (contactId, body, userId) => {
  const { name, email, phone } = body;
  await Contact.findOneAndUpdate(
    { _id: contactId, owner: userId },
    {
      $set: { name, email, phone },
    }
  );
  const result = await Contact.findOne({ _id: contactId, owner: userId });
  return result;
};

const updateStatusContact = async (contactId, body, userId) => {
  const { favorite } = body;
  await Contact.findOneAndUpdate(
    { _id: contactId, owner: userId },
    { favorite }
  );
  const result = await Contact.findOne({ _id: contactId, owner: userId });
  return result;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
