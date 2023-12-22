const AWS = require("aws-sdk");

const isLambda = !!process.env.LAMBDA_RUNTIME_DIR;

if (!isLambda) {
  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION || "us-east-1",
  });
}

module.exports = AWS;
