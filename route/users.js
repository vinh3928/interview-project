const express = require("express");
const usersRouter = express.Router();
const { getUsers, createUser } = require("../controller/users");

usersRouter.route("/getAddress").get(getUsers);
usersRouter.route("/storeAddress").post(createUser);

module.exports = usersRouter;
