const express = require("express");
require("dotenv").config();
const cors = require("cors");
var morgan = require("morgan");
const sequelize = require("./Utils/database");
const path = require("path");
const passport = require("passport");
const { Payment, User, Grade, Shift, Batch, Student } = require("./Model");
const { Op } = require("sequelize");
require("./Utils/passport");

// INITIALIZE APP
const app = express();
const port = process.env.PORT || 5000;

//Initializing the middlewares
app.use(express.json({ extended: false }));
app.use(express.urlencoded({ extended: true }));

// CORS for internal API (restricted to CLIENT_DOMAIN)
const internalCors = cors({
  origin: function (origin, callback) {
    const regularEx = RegExp(`${process.env.CLIENT_DOMAIN}$`, "i");

    if (regularEx.test(origin)) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  credentials: true,
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "x-api-key",
    "Access-Control-Allow-Origin",
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Methods",
  ],
  methods: ["GET", "PUT", "POST", "DELETE", "PATCH"],
});

// CORS for external API (allows all origins for 3rd party access)
const externalCors = cors({
  origin: "*", // Allow all origins for external API
  credentials: false,
  allowedHeaders: ["Content-Type", "Authorization", "x-api-key"],
  methods: ["POST"],
});

// Apply CORS middleware
app.use(internalCors);

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);
app.use(passport.initialize());

app.use(express.static(path.join(__dirname, "./client/dist")));

app.use("/api", require("./Routes/Auth"));
app.use("/api/payment", require("./Routes/Payment"));
app.use("/api/grade", require("./Routes/Grade"));
app.use("/api/student", require("./Routes/Student"));
app.use("/api/external", externalCors, require("./Routes/ExternalPayment"));

app.get("/*", (req, res) => {
  return res.sendFile(path.join(__dirname, "./client/dist", "index.html"));
});

// Sequelize Relations
// Note: Payment.userId refers to student ID from primary-coaching project, NOT a foreign key to User table
// Therefore, no relationship is defined between Payment and User

// Payment belongs to Student (composite foreign key)
// Note: Due to composite keys, constraints are disabled and relationships may need manual handling in queries
Payment.belongsTo(Student, {
  foreignKey: 'userId',
  targetKey: 'primaryId',
  constraints: false, // Disable foreign key constraint
  as: 'student',
});

// Payment belongs to Grade (composite foreign key)
Payment.belongsTo(Grade, {
  foreignKey: 'gradePrimaryId',
  targetKey: 'primaryId',
  constraints: false,
  as: 'grade',
});

// Payment belongs to Shift (composite foreign key)
Payment.belongsTo(Shift, {
  foreignKey: 'shiftPrimaryId',
  targetKey: 'primaryId',
  constraints: false,
  as: 'shift',
});

// Payment belongs to Batch (composite foreign key)
Payment.belongsTo(Batch, {
  foreignKey: 'batchPrimaryId',
  targetKey: 'primaryId',
  constraints: false,
  as: 'batch',
});

// Note: Grade, Shift, Batch use composite primary keys (tenant, primaryId)
// When querying with includes, you may need to add manual where clauses for tenant matching
// Example: { include: [{ model: Grade, as: 'grade', where: { tenant: 'primary' } }] }

// Sequelize Sync
// Using alter: true to add missing columns to existing tables (development only)
// In production, use proper migrations instead
sequelize
  .sync({ force: false, alter: true })
  .then(() => {
    console.log("Database synced successfully");
    // Start CRON job for syncing grades, shifts, and batches
    const { startSyncCron } = require("./Jobs/syncGradesCron");
    startSyncCron();
    
    // Start CRON job for syncing students
    const { startSyncCron: startStudentSyncCron } = require("./Jobs/syncStudentsCron");
    startStudentSyncCron();

    app.listen(port, () => {
      console.log(`Listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.log("Error creating database: ", err);
  });
