const express = require("express");
const { check, body } = require("express-validator");
const apiKeyAuth = require("../Utils/apiKeyAuth");
const { createExternalPayment } = require("../Controller/Payment/createExternalPayment");
const { createBulkExternalPayment } = require("../Controller/Payment/createBulkExternalPayment");
const { getExternalPaymentsByStudents } = require("../Controller/Payment/getExternalPaymentsByStudents");
const { getStudentMonthlyFees } = require("../Controller/Payment/getStudentMonthlyFees");

const router = express.Router();

// External Payment API Route (3rd party access) - Single payment
router.post(
  "/create",
  apiKeyAuth,
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
    check("year", "Year should be a valid year").optional().isInt({ min: 2000, max: 2100 }),
    check("extra_amount", "Extra amount should be a number")
      .optional()
      .isFloat({ min: 0 }),
    check("total_amount", "Total amount should be a number")
      .optional()
      .isFloat({ min: 0 }),
  ],
  createExternalPayment
);

// External Payment API Route (3rd party access) - Bulk create/update
router.post(
  "/create-bulk",
  apiKeyAuth,
  [
    body("payments", "Payments must be an array").isArray({ min: 1 }),
    body("payments.*.amount", "Amount is required and must be a number")
      .not()
      .isEmpty()
      .isFloat({ min: 0 }),
    body("payments.*.month", "Month is required").not().isEmpty().trim(),
    body("payments.*.userId", "User ID is required and must be a number")
      .not()
      .isEmpty()
      .isInt({ min: 1 }),
    body("payments.*.tenant", "Tenant should be a string").optional().isString(),
    body("payments.*.year", "Year should be a valid year").optional().isInt({ min: 2000, max: 2100 }),
    body("payments.*.extra_amount", "Extra amount should be a number")
      .optional()
      .isFloat({ min: 0 }),
    body("payments.*.total_amount", "Total amount should be a number")
      .optional()
      .isFloat({ min: 0 }),
  ],
  createBulkExternalPayment
);

// External Payment API Route (3rd party access) - Get payments by students
router.get(
  "/by-students",
  apiKeyAuth,
  getExternalPaymentsByStudents
);

// External Payment API Route (3rd party access) - Get student monthly fees
router.get(
  "/student-monthly-fees",
  apiKeyAuth,
  getStudentMonthlyFees
);

module.exports = router;

