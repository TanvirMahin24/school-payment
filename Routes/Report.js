const express = require("express");
const passport = require("passport");
const { getMonthlyStats } = require("../Controller/Report/getMonthlyStats");
const { getFilteredStats } = require("../Controller/Report/getFilteredStats");

const router = express.Router();

router.get(
  "/monthly",
  passport.authenticate("jwt", { session: false }),
  getMonthlyStats
);

router.get(
  "/filtered",
  passport.authenticate("jwt", { session: false }),
  getFilteredStats
);

module.exports = router;

