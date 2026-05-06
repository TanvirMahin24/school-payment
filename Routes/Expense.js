const express = require("express");
const passport = require("passport");
const { createExpense } = require("../Controller/Expense/createExpense");
const { getExpenses } = require("../Controller/Expense/getExpenses");
const { updateExpense } = require("../Controller/Expense/updateExpense");
const { deleteExpense } = require("../Controller/Expense/deleteExpense");
const { requireTenantAccess } = require("../Utils/permissions");

const router = express.Router();

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  requireTenantAccess,
  createExpense
);

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  requireTenantAccess,
  getExpenses
);

router.patch(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  requireTenantAccess,
  updateExpense
);

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  deleteExpense
);

module.exports = router;



