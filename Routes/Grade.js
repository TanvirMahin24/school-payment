const express = require("express");
const passport = require("passport");
const { getGrades } = require("../Controller/Grade/getGrades");

const router = express.Router();

// Grade Routes
router.get("/", passport.authenticate("jwt", { session: false }), getGrades);

module.exports = router;

