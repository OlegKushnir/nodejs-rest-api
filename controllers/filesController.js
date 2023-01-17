const {modifyAvatar} = require('../models/files')
const uploadController = async (req, res, next) => {
  const {file, user} = req
  const result = await modifyAvatar(file, user);
  res.json({avatarURL: result});
};

module.exports = {
    uploadController
};
