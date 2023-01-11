const express = require("express");
const {
  getById,
  getContacts,
  postContact,
  deleteContact,
  putContact,
  patchContact,
} = require("../../controllers/contactsControllers");
const { catchWrapper } = require("../../helpers/apiHelpers");
const { authMiddleware } = require("../../middlewares/authMiddleware");


const router = express.Router();

router.use(authMiddleware)
router.get("/", catchWrapper(getContacts));
router.get("/:contactId", catchWrapper(getById));
router.post("/", catchWrapper(postContact));
router.delete("/:contactId", catchWrapper(deleteContact));
router.put("/:contactId", catchWrapper(putContact));
router.patch("/:contactId/favorite", catchWrapper(patchContact));

module.exports = router;
