const fs = require("fs/promises");  
const path = require("path");
const contactsPath = path.resolve("models", "contacts.json");

const readContacts = async () => {
  return await fs.readFile(contactsPath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    return data;
  });
}

const listContacts = async () => {
  const result = await readContacts();
  return JSON.parse(result);
};

const getContactById = async (contactId) => {
  const result = await readContacts();
  const found = JSON.parse(result).find(
    (element) => element.id === String(contactId)
  );
  return found;
};

const removeContact = async (contactId) => {
  const contacts = JSON.parse(await readContacts());
  const newContacts = contacts.filter((c) => c.id !== String(contactId));
  if (contacts.length === newContacts.length) {
    return;
  }
  await fs.writeFile(contactsPath, JSON.stringify(newContacts), (err) => {
    if (err) {
      console.error(err);
      return;
    }
  });
  return contactId;
};

const addContact = async (body) => {
  const contacts = JSON.parse(await readContacts());
  const id = new Date().getTime().toString();
  const contact = { id, ...body };
  const newContacts = [...contacts, contact];
  await fs.writeFile(contactsPath, JSON.stringify(newContacts), (err) => {
    if (err) {
      console.error(err);
      return;
    }
  });
  return contact;
};

const updateContact = async (contactId, body) => {
  const contacts = JSON.parse(await readContacts());
  const found = contacts.find((element) => element.id === String(contactId));
  if (!found) return;
  const deleteContact = contacts.filter((c) => c.id !== String(contactId));
  const updatedContact = { ...found, ...body };
  const newContacts = [...deleteContact, updatedContact];
  await fs.writeFile(contactsPath, JSON.stringify(newContacts), (err) => {
    if (err) {
      console.error(err);
      return;
    }
  });
  return updatedContact;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
