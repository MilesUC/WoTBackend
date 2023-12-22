const serverless = require("serverless-http");
const app = require("./app");

module.exports.handler = (event, context) => {
  // Print the event and context to the console
  console.log("Event:", event);
  console.log("Context:", context);

  // Return the serverless handler
  return serverless(app)(event, context);
};
