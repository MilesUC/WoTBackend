const aws = require("../config/awsConfig");
const multer = require("multer");
const multerS3 = require("multer-s3");
const dotenv = require("dotenv");

dotenv.config();

const filterFile = (req, file, cb) => {
  if (!file) {
    cb(new Error('No file uploaded'), false);
  } else {
    if (file.originalname.endsWith('.pdf')) {
        cb(null, true);
      } else {
        cb(new Error('File must have .pdf extension'), false);
    }
  }
};

const s3 = new aws.S3();

const cvUploader = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET_NAME,
    acl: 'private',
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    contentType: function (req, file, cb) {
        const dataArray = file.originalname.split(".");
        const extension = dataArray[dataArray.length - 1];
        const type = `application/${extension}`;
        cb(null ,type);
    },
    key: function (req, file, cb) {

      const userId = req.cognitoUserId;
      req.cvkey = `s3://${process.env.S3_BUCKET_NAME}/usercvs/${userId}/${userId}.pdf`
      const key = `usercvs/${userId}/${userId}.pdf`;
      cb(null, key);
    },
  }),
  fileFilter: filterFile,
});

module.exports = cvUploader;