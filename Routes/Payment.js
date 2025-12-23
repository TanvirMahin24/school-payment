const express = require("express");
const passport = require("passport");

const { check } = require("express-validator");
const { createPayment } = require("../Controller/Payment/createPayment");
const { deletePayment } = require("../Controller/Payment/deletePayment");
const { updatePayment } = require("../Controller/Payment/updatePayment");
const { getPayments } = require("../Controller/Payment/getPayment");
const {
  getPaymentDetails,
} = require("../Controller/Payment/getPaymentDetails");

const router = express.Router();

// Payment Routes

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  [
    check("amount", "Amount is required and must be a number")
      .not()
      .isEmpty()
      .isFloat({ min: 0 }),
    check("month", "Month is required").not().isEmpty().trim(),
    check("userId", "User ID is required and must be a number")
      .not()
      .isEmpty()
      .isInt({ min: 1 }),
    check("tenant", "Tenant should be a string").optional().isString(),
    check("year", "Year should be a valid year")
      .optional()
      .isInt({ min: 2000, max: 2100 }),
    check("extra_amount", "Extra amount should be a number")
      .optional()
      .isFloat({ min: 0 }),
    check("total_amount", "Total amount should be a number")
      .optional()
      .isFloat({ min: 0 }),
    check("gradeId", "Grade ID should be a number")
      .optional()
      .isInt({ min: 1 }),
    check("shiftId", "Shift ID should be a number")
      .optional()
      .isInt({ min: 1 }),
    check("batchId", "Batch ID should be a number")
      .optional()
      .isInt({ min: 1 }),
  ],
  createPayment
);

router.get("/", passport.authenticate("jwt", { session: false }), getPayments);

router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  getPaymentDetails
);

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  deletePayment
);

router.patch(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  [
    check("amount", "Amount is required and must be a number")
      .not()
      .isEmpty()
      .isFloat({ min: 0 }),
    check("month", "Month is required").not().isEmpty().trim(),
    check("userId", "User ID is required and must be a number")
      .not()
      .isEmpty()
      .isInt({ min: 1 }),
    check("tenant", "Tenant should be a string").optional().isString(),
    check("year", "Year should be a valid year")
      .optional()
      .isInt({ min: 2000, max: 2100 }),
    check("extra_amount", "Extra amount should be a number")
      .optional()
      .isFloat({ min: 0 }),
    check("total_amount", "Total amount should be a number")
      .optional()
      .isFloat({ min: 0 }),
    check("gradeId", "Grade ID should be a number")
      .optional()
      .isInt({ min: 1 }),
    check("shiftId", "Shift ID should be a number")
      .optional()
      .isInt({ min: 1 }),
    check("batchId", "Batch ID should be a number")
      .optional()
      .isInt({ min: 1 }),
  ],
  updatePayment
);

module.exports = router;
