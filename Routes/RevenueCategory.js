const express = require("express");
const passport = require("passport");
const { createRevenueCategory } = require("../Controller/RevenueCategory/createRevenueCategory");
const { getRevenueCategories } = require("../Controller/RevenueCategory/getRevenueCategories");
const { updateRevenueCategory } = require("../Controller/RevenueCategory/updateRevenueCategory");
const { deleteRevenueCategory } = require("../Controller/RevenueCategory/deleteRevenueCategory");

const router = express.Router();

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  createRevenueCategory
);

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  getRevenueCategories
);

router.patch(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  updateRevenueCategory
);

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  deleteRevenueCategory
);

module.exports = router;




