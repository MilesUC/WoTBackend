const verifyAndDecodeJWT = require("../../utils/verifyAndDecodeCognitoJWT");

async function checkCognitoToken(req, res, next) {
  const { email } = req.body;
  // if (process.env.NODE_ENV == "test") {
  //   return next();
  // }

  
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const token = req.headers.authorization.split(" ")[1];

    let cognitoUserId =
      req.requestContext?.authorizer?.claims["cognito:username"] ||
      (await verifyAndDecodeJWT(token)).username;

    req.cognitoUserId = cognitoUserId;

    next(); // RUT does not exist, proceed to the next middleware/controller
  } catch (error) {
    console.error("Error checking:", error);
    return res.status(401).json({ error: error.message });
  }
}

module.exports = checkCognitoToken;
