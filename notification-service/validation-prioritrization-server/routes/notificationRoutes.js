const express = require("express");
const jwtAuth = require("../middleware/jwtAuth");
const router = express.Router();

router.post("/send-notification", jwtAuth, validateAndPrioritrize);

module.exports = { router };