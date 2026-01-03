const express = require("express");
const passport = require("passport");
const { getGrades } = require("../Controller/Grade/getGrades");
const { syncGradesController } = require("../Controller/Grade/syncGrades");

const router = express.Router();

// Grade Routes
router.get("/", passport.authenticate("jwt", { session: false }), getGrades);
router.post(
  "/sync",
  passport.authenticate("jwt", { session: false }),
  syncGradesController
);

module.exports = router;

