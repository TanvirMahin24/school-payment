const express = require("express");
const passport = require("passport");
const { createCombinedRevenue } = require("../Controller/CombinedRevenue/createCombinedRevenue");
const { getCombinedRevenues } = require("../Controller/CombinedRevenue/getCombinedRevenues");
const { updateCombinedRevenue } = require("../Controller/CombinedRevenue/updateCombinedRevenue");
const { deleteCombinedRevenue } = require("../Controller/CombinedRevenue/deleteCombinedRevenue");

const router = express.Router();

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  createCombinedRevenue
);

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  getCombinedRevenues
);

router.patch(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  updateCombinedRevenue
);

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  deleteCombinedRevenue
);

module.exports = router;
