const path = require("path");
const Jimp = require("jimp");
const fs = require("fs");
const { User } = require("../db/userModel");
const { v4: uuidv4 } = require("uuid");

const TMP_DIR = path.resolve("./tmp");
const PUBLIC_DIR = path.resolve("./public/avatars");

const modifyAvatar = async (fileInfo, userInfo) => {
  const uniqName = uuidv4();
  const { _id } = userInfo;
  
  Jimp.read(`${TMP_DIR}/${fileInfo.originalname}`)
    .then((avatar) => {
      return avatar
        .resize(250, 250) // resize
        .quality(60) // set JPEG quality
        .write(`${PUBLIC_DIR}/${uniqName}.jpg`); // save
    })
    .catch((err) => {
      console.error(err);
    });

  fs.unlink(`${TMP_DIR}/${fileInfo.originalname}`, (err) => {
    if (err) {
      throw err;
    }
  });
  
  const avatarURL = `/avatars/${uniqName}.jpg`;
  await User.findOneAndUpdate({ _id }, { avatarURL }, { new: true });
  return avatarURL;
};

module.exports = { modifyAvatar };
