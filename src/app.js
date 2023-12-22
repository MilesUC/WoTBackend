const express = require("express");
const { connectDB } = require("./config/sequelizeConfig");
const dotenv = require("dotenv");

// Middlewares imports
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const router = require("./routes");
const errorHandler = require("./middlewares/errorHandler");

// Swagger
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerSpec = require("./config/swaggerConfig");

// Init services
const app = express();
dotenv.config();

// Cors Settings
const corsOptions = {
  // origin: "*",
  origin: [
    "https://2023-2-s2-grupo2-web.vercel.app",
    "https://2023-2-s2-grupo2-web.vercel.app/",
    "http://localhost:5000",
    "https://2023-2-s2-grupo2-ihmdafg08-wot-capstone-2023.vercel.app",
    "https://2023-2-s2-grupo2-ihmdafg08-wot-capstone-2023.vercel.app/",
  ],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Middlewares
app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(router);
app.use(errorHandler);
app.use(
  "/api-doc",
  swaggerUI.serve,
  swaggerUI.setup(swaggerJsDoc(swaggerSpec))
);

module.exports = app;

const PORT = 8000;
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, async () => {
    console.log("🚀Server started Successfully");
    await connectDB();
  });
}
