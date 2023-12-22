const CognitoSDK = require("amazon-cognito-identity-js-node");
const aws = require("../config/awsConfig");

const cognitoIdentityServiceProvider = new aws.CognitoIdentityServiceProvider();

cognitoIdentityServiceProvider.AuthenticationDetails =
  CognitoSDK.AuthenticationDetails;
cognitoIdentityServiceProvider.CognitoUserPool = CognitoSDK.CognitoUserPool;
cognitoIdentityServiceProvider.CognitoUser = CognitoSDK.CognitoUser;

async function adminCreateUser(name, email, password) {
  try {
    const params = {
      UserPoolId: process.env.USER_POOL_ID,
      Username: email,
      TemporaryPassword: password,
      UserAttributes: [
        {
          Name: "name",
          Value: name,
        },
        {
          Name: "email",
          Value: email,
        },
        {
          Name: "email_verified",
          Value: "true",
        },
      ],

      MessageAction: "SUPPRESS",
    };

    return await cognitoIdentityServiceProvider
      .adminCreateUser(params)
      .promise();
  } catch (error) {
    console.log("Error:", error.message);
    throw error;
  }
}

async function initiateAuth(email, password) {
  const params = {
    AuthFlow: "USER_PASSWORD_AUTH",
    ClientId: process.env.CLIENT_ID,
    AuthParameters: {
      USERNAME: email,
      PASSWORD: password,
    },
  };
  const response = await cognitoIdentityServiceProvider
    .initiateAuth(params)
    .promise();

  return response;
}

async function adminSetPassword(email, newPassword) {
  await cognitoIdentityServiceProvider
    .adminSetUserPassword({
      UserPoolId: process.env.USER_POOL_ID,
      Username: email,
      Password: newPassword,
      Permanent: true,
    })
    .promise();
}

async function adminDeleteUser(email) {
  const params = {
    UserPoolId: process.env.USER_POOL_ID,
    Username: email,
  };
  return await cognitoIdentityServiceProvider.adminDeleteUser(params).promise();
}

async function confirmForgotPassword(email, code, newPassword) {
  const params = {
    ClientId: process.env.CLIENT_ID,
    Username: email,
    ConfirmationCode: code,
    Password: newPassword,
  };

  return await cognitoIdentityServiceProvider
    .confirmForgotPassword(params)
    .promise();
}

async function forgotPassword(email) {
  const params = {
    Username: email,
    ClientId: process.env.CLIENT_ID,
  };

  return await cognitoIdentityServiceProvider.forgotPassword(params).promise();
}

async function refreshAccessToken(refreshToken) {
  const params = {
    AuthFlow: "REFRESH_TOKEN",
    ClientId: process.env.CLIENT_ID,
    AuthParameters: {
      REFRESH_TOKEN: refreshToken,
    },
  };
  const response = await cognitoIdentityServiceProvider
    .initiateAuth(params)
    .promise();

  return response;
}

module.exports = {
  initiateAuth,
  adminSetPassword,
  adminDeleteUser,
  confirmForgotPassword,
  forgotPassword,
  adminCreateUser,
  refreshAccessToken,
};
