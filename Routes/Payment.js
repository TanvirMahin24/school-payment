const express = require("express");
const passport = require("passport");

const { check } = require("express-validator");
const { createPayment } = require("../Controller/Payment/createPayment");
const { deletePayment } = require("../Controller/Payment/deletePayment");
const { updatePayment } = require("../Controller/Payment/updatePayment");
const { getPayments } = require("../Controller/Payment/getPayment");
const { getPaymentDetails } = require("../Controller/Payment/getPaymentDetails");

const router = express.Router();

// Payment Routes

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  [
    check("amount", "Amount is required").not().isEmpty(),
    check("month", "Month is required").not().isEmpty(),
    check("userId", "User ID is required").not().isEmpty(),
  ],
  createPayment
);

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  getPayments
);

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
    check("amount", "Amount is required").not().isEmpty(),
    check("month", "Month is required").not().isEmpty(),
    check("userId", "User ID is required").not().isEmpty(),
  ],
  updatePayment
);

module.exports = router;


