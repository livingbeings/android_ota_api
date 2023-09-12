const express = require("express");
const swaggerUI = require("swagger-ui-express");
const swaggerFile = require("./swagger-output.json");
const encrypt = require("./lib/encryption.js")
const androidRouter = require('./routes/android.js');

const PORT = process.env.PORT || 80;

const app = express();
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerFile))
app.use("/", androidRouter);
app.use(express.json());
