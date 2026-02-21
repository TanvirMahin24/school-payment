const express = require("express");
const passport = require("passport");
const { getMonthlyStats } = require("../Controller/Report/getMonthlyStats");
const { getFilteredStats } = require("../Controller/Report/getFilteredStats");
const { getGradeBreakdown } = require("../Controller/Report/getGradeBreakdown");
const { getShiftBreakdown } = require("../Controller/Report/getShiftBreakdown");
const { getBatchBreakdown } = require("../Controller/Report/getBatchBreakdown");
const { getMonthlyIncomeExpense } = require("../Controller/Report/getMonthlyIncomeExpense");
const { getYearlyExpenseReport } = require("../Controller/Report/getYearlyExpenseReport");
const { getYearlyIncomeReport } = require("../Controller/Report/getYearlyIncomeReport");
const { getSchoolPrimaryReport } = require("../Controller/Report/getSchoolPrimaryReport");

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

router.get(
  "/income-expense-statement",
  passport.authenticate("jwt", { session: false }),
  getMonthlyIncomeExpense
);

router.get(
  "/yearly-expense",
  passport.authenticate("jwt", { session: false }),
  getYearlyExpenseReport
);

router.get(
  "/yearly-income",
  passport.authenticate("jwt", { session: false }),
  getYearlyIncomeReport
);

router.get(
  "/school-primary",
  passport.authenticate("jwt", { session: false }),
  getSchoolPrimaryReport
);

module.exports = router;



