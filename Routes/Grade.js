const express = require("express");
const passport = require("passport");
const { getGrades } = require("../Controller/Grade/getGrades");
const { syncGradesController } = require("../Controller/Grade/syncGrades");
const { requireTenantAccess } = require("../Utils/permissions");

const router = express.Router();

// Grade Routes
router.get("/", passport.authenticate("jwt", { session: false }), requireTenantAccess, getGrades);
router.post(
  "/sync",
  passport.authenticate("jwt", { session: false }),
  requireTenantAccess,
  syncGradesController
);

module.exports = router;
