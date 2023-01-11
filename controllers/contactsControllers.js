const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  updateStatusContact,
} = require("../models/contacts");
const Joi = require("joi");

const getContacts = async (req, res, next) => {
  let { page = 1, limit = 20, favorite } = req.query;
  limit = parseInt(limit) > 20 ? 20 : parseInt(limit);
  page = parseInt(page);
  const contacts = await listContacts(req.user._id, { page, limit, favorite });
  res.status(200).json({ contacts, page, limit });
};

const getById = async (req, res, next) => {
  const serchedContact = await getContactById(
    req.params.contactId,
    req.user._id
  );
  if (serchedContact) res.status(200).json(serchedContact);
  else res.status(404).json({ message: "Not found" });
};

const postContact = async (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string()
      .pattern(/^[a-zA-Z ]{3,30}$/)
      .required(),
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
      .required(),
    phone: Joi.string()
      .pattern(/^\([0-9]{3}\) [0-9]{3}-[0-9]{4}$/)
      .required(),
    favorite: Joi.boolean().default(false),
  });
  const validationResult = schema.validate(req.body);
  if (validationResult.error) {
    return res.status(400).json({ error: validationResult.error });
  } else res.status(201).json(await addContact(req.body, req.user._id));
};

const deleteContact = async (req, res, next) => {
  const deletedContact = await removeContact(
    req.params.contactId,
    req.user._id
  );
  if (deletedContact) res.status(200).json({ message: "contact deleted" });
  else res.status(404).json({ message: "Not found" });
};

const putContact = async (req, res, next) => {
  const { name, email, phone } = req.body;
  const schema = Joi.object({
    name: Joi.string().pattern(/^[a-zA-Z ]{3,30}$/),
    email: Joi.string().email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    }),
    phone: Joi.string().pattern(/^\([0-9]{3}\) [0-9]{3}-[0-9]{4}$/),
    favorite: Joi.boolean(),
  });
  const validationResult = schema.validate(req.body);
  if (validationResult.error) {
    return res.status(400).json({ error: validationResult.error });
  }
  if (name || email || phone) {
    const upContact = await updateContact(
      req.params.contactId,
      req.body,
      req.user._id
    );
    if (!upContact) res.status(404).json({ message: "Not found" });
    res.status(200).json(upContact);
  } else res.status(400).json({ message: "missing fields" });
};

const patchContact = async (req, res, next) => {
  if (
    Object.keys(req.body).length === 1 &&
    Object.keys(req.body)[0] === "favorite"
  ) {
    const upContact = await updateStatusContact(
      req.params.contactId,
      req.body,
      req.user._id
    );
    if (!upContact) res.status(404).json({ message: "Not found patch" });
    res.status(200).json(upContact);
  } else res.status(400).json({ message: "missing field favorite" });
};

module.exports = {
  getById,
  getContacts,
  postContact,
  deleteContact,
  putContact,
  patchContact,
};
