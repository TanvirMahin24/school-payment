const express = require("express");
const passport = require("passport");
const { createRevenue } = require("../Controller/Revenue/createRevenue");
const { getRevenues } = require("../Controller/Revenue/getRevenues");
const { updateRevenue } = require("../Controller/Revenue/updateRevenue");
const { deleteRevenue } = require("../Controller/Revenue/deleteRevenue");

const router = express.Router();

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  createRevenue
);

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  getRevenues
);

router.patch(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  updateRevenue
);

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  deleteRevenue
);

module.exports = router;




