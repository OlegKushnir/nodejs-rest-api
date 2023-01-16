const express = require("express");
const {
  postRegister,
  postLogin,
  postLogout,
  getCurrent,
} = require("../../controllers/authControllers");
const {uploadController} = require('../../controllers/filesController')

const { catchWrapper } = require("../../helpers/apiHelpers");
const { authMiddleware } = require("../../middlewares/authMiddleware");
const { uploadMiddleware } = require("../../middlewares/uploadMiddleware");

const router = express.Router();

router.post("/register", catchWrapper(postRegister));
router.post("/login", catchWrapper(postLogin));
router.post("/logout", authMiddleware, catchWrapper(postLogout));
router.get("/current", authMiddleware, catchWrapper(getCurrent));
router.patch("/avatars", [uploadMiddleware.single('avatar'),authMiddleware], catchWrapper(uploadController));

module.exports = router;
