const express = require("express");
require('dotenv').config();
const cors = require("cors");
const morgan = require('morgan');
const swaggerUI = require("swagger-ui-express");
const swaggerFile = require("./swagger-output.json");
const encryption = new (require("./lib/encryption.js"))();
const sql = new (require("./lib/sqlite.js"))();
const androidRouter = require('./routes/android.js');
const authRouter = require('./routes/auth.js');

const PORT = process.env.PORT || 80;

const app = express();
console.log(process.env.PORT)
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerFile));
app.db = sql;
app.encryption = encryption;
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use("/auth", authRouter);
app.use("/android", androidRouter);
app.use(express.json());
app.listen(PORT, () => console.log(`The server is running on port ${PORT}`));
