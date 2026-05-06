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
const {
  requireTenantAccess,
  requireCombinedSchoolPrimaryReportAccess,
} = require("../Utils/permissions");

const router = express.Router();

router.get(
  "/monthly",
  passport.authenticate("jwt", { session: false }),
  requireTenantAccess,
  getMonthlyStats
);

router.get(
  "/filtered",
  passport.authenticate("jwt", { session: false }),
  requireTenantAccess,
  getFilteredStats
);

router.get(
  "/grade-breakdown",
  passport.authenticate("jwt", { session: false }),
  requireTenantAccess,
  getGradeBreakdown
);

router.get(
  "/shift-breakdown",
  passport.authenticate("jwt", { session: false }),
  requireTenantAccess,
  getShiftBreakdown
);

router.get(
  "/batch-breakdown",
  passport.authenticate("jwt", { session: false }),
  requireTenantAccess,
  getBatchBreakdown
);

router.get(
  "/income-expense-statement",
  passport.authenticate("jwt", { session: false }),
  requireTenantAccess,
  getMonthlyIncomeExpense
);

router.get(
  "/yearly-expense",
  passport.authenticate("jwt", { session: false }),
  requireTenantAccess,
  getYearlyExpenseReport
);

router.get(
  "/yearly-income",
  passport.authenticate("jwt", { session: false }),
  requireTenantAccess,
  getYearlyIncomeReport
);

router.get(
  "/school-primary",
  passport.authenticate("jwt", { session: false }),
  requireCombinedSchoolPrimaryReportAccess,
  getSchoolPrimaryReport
);

module.exports = router;


