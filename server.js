const express = require("express");
const dotenv = require("dotenv");
const app = express();
const { logger } = require("./middleware/logger");
const usersRouter = require("./route/users");
const { db } = require("./config/db");
const { errorHandling } = require("./middleware/errorHandling");

dotenv.config({ path: "./config/env.config" });

const port = process.env.PORT;
const nodeEnv = process.env.NODE_ENV;

app.use(logger);
app.use(express.json());

db();

app.use("/", usersRouter);

app.use(errorHandling);

app.listen(port, console.log(`listening in ${nodeEnv} on port: ${port}`));
