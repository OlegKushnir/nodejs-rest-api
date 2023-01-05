const express = require("express");
const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
} = require("../../models/contacts");
const Joi = require("joi");

const router = express.Router();

router.get("/", async (req, res, next) => {
  const contacts = await listContacts();
  res.status(200).json({ contacts });
});

router.get("/:contactId", async (req, res, next) => {
  const serchedContact = await getContactById(req.params.contactId);
  if (serchedContact) res.status(200).json(serchedContact);
  else res.status(404).json({ message: "Not found" });
});

router.post("/", async (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string()
    .pattern(/^[a-zA-Z ]{3,30}$/)
    .required(),
    email: Joi.string().email({minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    }).required(),
    phone: Joi.string()
    .pattern(/^\([0-9]{3}\) [0-9]{3}-[0-9]{4}$/).required(),

  });
  const validationResult = schema.validate(req.body);
  if (validationResult.error) {
    return res.status(400).json({error:validationResult.error})
  }
  else
  res.status(201).json(await addContact(req.body));

});

router.delete("/:contactId", async (req, res, next) => {
  const deletedContact = await removeContact(req.params.contactId);
  if (deletedContact) res.status(200).json({ message: "contact deleted" });
  else res.status(404).json({ message: "Not found" });
});

router.put("/:contactId", async (req, res, next) => {
  const { name, email, phone } = req.body;
  const schema = Joi.object({
    name: Joi.string()
    .pattern(/^[a-zA-Z ]{3,30}$/),
    email: Joi.string().email({minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    }),
    phone: Joi.string()
    .pattern(/^\([0-9]{3}\) [0-9]{3}-[0-9]{4}$/),

  });
  const validationResult = schema.validate(req.body);
  if (validationResult.error) {
    return res.status(400).json({error:validationResult.error})
  }
  if (name || email || phone) {
    const upContact = await updateContact(req.params.contactId, req.body);
    if (!upContact) res.status(404).json({ message: "Not found" });
    res.status(200).json(upContact);
  } else res.status(400).json({ message: "missing fields" });
});

module.exports = router;
