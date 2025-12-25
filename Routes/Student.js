const express = require("express");
const passport = require("passport");
const { syncAllStudents } = require("../Controller/Student/syncAllStudents");
const {
  syncRecentStudents,
} = require("../Controller/Student/syncRecentStudents");
const { getSyncStatus } = require("../Controller/Student/getSyncStatus");
const { getStudents } = require("../Controller/Student/getStudents");

const router = express.Router();

// Student Routes
router.post(
  "/sync-all",
  passport.authenticate("jwt", { session: false }),
  syncAllStudents
);

router.post(
  "/sync-recent",
  passport.authenticate("jwt", { session: false }),
  syncRecentStudents
);

router.get(
  "/sync-status",
  passport.authenticate("jwt", { session: false }),
  getSyncStatus
);

router.get("/", passport.authenticate("jwt", { session: false }), getStudents);

module.exports = router;
