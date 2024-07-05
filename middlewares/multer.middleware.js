const multer = require("multer");
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    const extension = file.mimetype.split("/");
    cb(null, `${new Date().getTime()}.${extension[1]}`);
  },
});
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (!file) cb(null, false);
    else cb(null, true);
  },
});
module.exports = {
  upload,
};


// const multer = require('multer')

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, "./public/temp");
//     },
//     filename: function (req, file, cb) {
//         cb(null, file.originalname);
//     },
// });

// export const upload = multer({ storage });
