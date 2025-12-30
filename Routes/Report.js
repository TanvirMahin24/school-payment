const express = require("express");
const passport = require("passport");
const { getMonthlyStats } = require("../Controller/Report/getMonthlyStats");
const { getFilteredStats } = require("../Controller/Report/getFilteredStats");
const { getGradeBreakdown } = require("../Controller/Report/getGradeBreakdown");
const { getShiftBreakdown } = require("../Controller/Report/getShiftBreakdown");
const { getBatchBreakdown } = require("../Controller/Report/getBatchBreakdown");

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

router.get(
  "/grade-breakdown",
  passport.authenticate("jwt", { session: false }),
  getGradeBreakdown
);

router.get(
  "/shift-breakdown",
  passport.authenticate("jwt", { session: false }),
  getShiftBreakdown
);

router.get(
  "/batch-breakdown",
  passport.authenticate("jwt", { session: false }),
  getBatchBreakdown
);

module.exports = router;



