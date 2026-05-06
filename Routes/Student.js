const express = require("express");
const passport = require("passport");
const { syncAllStudents } = require("../Controller/Student/syncAllStudents");
const {
  syncRecentStudents,
} = require("../Controller/Student/syncRecentStudents");
const { getSyncStatus } = require("../Controller/Student/getSyncStatus");
const { getStudents } = require("../Controller/Student/getStudents");
const { requireTenantAccess } = require("../Utils/permissions");

const router = express.Router();

// Student Routes
router.post(
  "/sync-all",
  passport.authenticate("jwt", { session: false }),
  requireTenantAccess,
  syncAllStudents
);

router.post(
  "/sync-recent",
  passport.authenticate("jwt", { session: false }),
  requireTenantAccess,
  syncRecentStudents
);

router.get(
  "/sync-status",
  passport.authenticate("jwt", { session: false }),
  requireTenantAccess,
  getSyncStatus
);

router.get("/", passport.authenticate("jwt", { session: false }), requireTenantAccess, getStudents);

module.exports = router;
