const {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  verifyUser,
  repeatEmail,
} = require("../models/auth");
const Joi = require("joi");

const postRegister = async (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
      .required(),
    password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  });
  const validationResult = schema.validate(req.body);
  if (validationResult.error) {
    return res.status(400).json({ error: validationResult.error });
  }

  const { password, email } = req.body;
  const result = await registerUser(password, email);
  const { subscription } = result;
  res.status(201).json({ user: { email, subscription } });
};

const verifyEmailController = async (req, res, next) => {
  const { verificationToken } = req.params;
  await verifyUser(verificationToken);
  res.status(200).json({ message: "Verification successful" });
};

const repeatEmailController = async (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
      .required(),
  });
  const validationResult = schema.validate(req.body);
  if (validationResult.error) {
    return res.status(400).json({ error: validationResult.error });
  }
  const { email } = req.body;
  await repeatEmail(email);
  res.status(200).json({ message: "Verification email sent" });
};

const postLogin = async (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
      .required(),
    password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  });
  const validationResult = schema.validate(req.body);
  if (validationResult.error) {
    return res.status(400).json({ error: validationResult.error });
  }

  const { password, email } = req.body;
  const result = await loginUser(password, email);
  const {
    token,
    user: { subscription },
  } = result;
  res.status(200).json({ token, user: { email, subscription } });
};

const postLogout = async (req, res, next) => {
  const { user } = req;
  await logoutUser(user._id);
  res.status(204).json({ message: "Logged out" });
};
const getCurrent = async (req, res, next) => {
  const { user } = req;
  const { email, subscription } = await getCurrentUser(user._id);
  res.status(200).json({ email, subscription });
};

module.exports = {
  postRegister,
  postLogin,
  postLogout,
  getCurrent,
  verifyEmailController,
  repeatEmailController,
};
