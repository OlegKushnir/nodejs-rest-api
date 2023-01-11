const express = require("express");
const {
  postRegister,
  postLogin,
  postLogout,
  getCurrent,
} = require("../../controllers/authControllers");
const { catchWrapper } = require("../../helpers/apiHelpers");
const { authMiddleware } = require("../../middlewares/authMiddleware");
const router = express.Router();

router.post("/register", catchWrapper(postRegister));
router.post("/login", catchWrapper(postLogin));
router.post("/logout", authMiddleware, catchWrapper(postLogout));
router.get("/current", authMiddleware, catchWrapper(getCurrent));

module.exports = router;
