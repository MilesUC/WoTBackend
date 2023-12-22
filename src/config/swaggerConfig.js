const path = require("path");

module.exports = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "WoT's Users API",
      description: "API para la aplicación de usuarias de Woman Talent",
      version: "1.0.0",
    },
    components: {
      securitySchemes: {
        Authorization: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          // value: "Bearer <JWT token here>"
        },
      },
    },
  },
  apis: [`${path.join(__dirname, "../routes/*.js")}`],
};
