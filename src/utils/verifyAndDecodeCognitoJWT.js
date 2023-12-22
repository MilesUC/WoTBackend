const { CognitoJwtVerifier } = require("aws-jwt-verify");

const verifyAndDecodeJWT = async (token) => {
  // Verifier that expects valid access tokens:
  const verifier = CognitoJwtVerifier.create({
    userPoolId: process.env.USER_POOL_ID,
    tokenUse: "access",
    clientId: process.env.CLIENT_ID,
  });

  try {
    const payload = await verifier.verify(token);
    // console.log("Token is valid. Payload:", payload);
    return payload;
  } catch(error) {
    console.log("Token not valid!", error.message);
    throw new Error("Token not valid!");
  }
};

module.exports = verifyAndDecodeJWT;
