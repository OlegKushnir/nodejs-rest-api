const { User } = require("../db/userModel");
const {
  NotAutorizedError,
  RegistrationConflictError,
} = require("../helpers/errors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async (password, email) => {
  const user = new User({
    password,
    email,
  });
  const result = await user.save();
  if (!result) throw new RegistrationConflictError("Email in use");
  return result;
};

const loginUser = async (password, email) => {
  const login = await User.findOne({ email });
  if (!login || !(await bcrypt.compare(password, login.password)))
    throw new NotAutorizedError("Email or password is wrong");
  const token = jwt.sign(
    {
      _id: login._id,
    },
    process.env.JWT_SECRET
  );
  const user = await User.findOneAndUpdate({ _id: login._id },{token})
  return { token, user };
};

const logoutUser = async (id) => {
    await User.findOneAndUpdate({ _id: id },{token: null})
    return;
  };
  const getCurrentUser = async (id) => {
    return await User.findOne({ _id: id });
  };

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser
};
