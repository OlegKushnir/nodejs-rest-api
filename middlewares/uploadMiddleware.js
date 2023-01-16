const path = require('path')
const multer = require('multer')

const TMP_DIR = path.resolve('./tmp/');

const storage = multer.diskStorage({
  destination: (req,file,cb)=>{
    cb(null, TMP_DIR)
  },
  filename: (req, file, cb) => {
    const [fileName, ext] = file.originalname.split('.');
    cb(null,`${fileName}.${ext}`);
  }
})
const uploadMiddleware = multer({storage});

module.exports={
    uploadMiddleware
}