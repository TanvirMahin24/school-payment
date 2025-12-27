const express = require("express");
const passport = require("passport");
const { createExpenseCategory } = require("../Controller/ExpenseCategory/createExpenseCategory");
const { getExpenseCategories } = require("../Controller/ExpenseCategory/getExpenseCategories");
const { updateExpenseCategory } = require("../Controller/ExpenseCategory/updateExpenseCategory");
const { deleteExpenseCategory } = require("../Controller/ExpenseCategory/deleteExpenseCategory");

const router = express.Router();

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  createExpenseCategory
);

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  getExpenseCategories
);

router.patch(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  updateExpenseCategory
);

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  deleteExpenseCategory
);

module.exports = router;


