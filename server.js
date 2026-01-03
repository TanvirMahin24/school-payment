const express = require("express");
require("dotenv").config();
const cors = require("cors");
var morgan = require("morgan");
const sequelize = require("./Utils/database");
const path = require("path");
const fs = require("fs");
const passport = require("passport");
const {
  Payment,
  User,
  Grade,
  Shift,
  Batch,
  Student,
  Expense,
  Revenue,
  ExpenseCategory,
  RevenueCategory,
} = require("./Model");
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

// Serve static files with case-insensitive path handling for assets
const staticOptions = {
  setHeaders: (res, filePath) => {
    // Ensure JavaScript modules are served with correct MIME type
    if (filePath.endsWith(".js")) {
      res.setHeader("Content-Type", "application/javascript; charset=utf-8");
    }
  },
};

app.use(express.static(path.join(__dirname, "./client/dist"), staticOptions));

// Handle case-insensitive asset directory requests (assets vs Assets)
app.use((req, res, next) => {
  if (
    req.path.toLowerCase().startsWith("/assets/") &&
    !req.path.startsWith("/Assets/")
  ) {
    const correctedPath = req.path.replace(/^\/assets\//i, "/Assets/");
    const filePath = path.join(__dirname, "./client/dist", correctedPath);
    if (fs.existsSync(filePath)) {
      return res.sendFile(filePath);
    }
  }
  next();
});

app.use("/api", require("./Routes/Auth"));
app.use("/api/payment", require("./Routes/Payment"));
app.use("/api/grade", require("./Routes/Grade"));
app.use("/api/student", require("./Routes/Student"));
app.use("/api/external", externalCors, require("./Routes/ExternalPayment"));
app.use("/api/expense", require("./Routes/Expense"));
app.use("/api/revenue", require("./Routes/Revenue"));
app.use("/api/expense-category", require("./Routes/ExpenseCategory"));
app.use("/api/revenue-category", require("./Routes/RevenueCategory"));
app.use("/api/report", require("./Routes/Report"));

// Catch-all handler: serve index.html for non-API routes that don't match static files
// Static files are already handled by the express.static middleware above
app.get("/*", (req, res, next) => {
  // Skip if it's an API route
  if (req.path.startsWith("/api")) {
    return next();
  }

  // Skip if it's a request for a file with an extension (static asset)
  // This ensures static files (js, css, images, etc.) are not served as HTML
  const ext = path.extname(req.path);
  if (ext) {
    // Let Express handle 404 for missing static files instead of serving HTML
    return next();
  }

  // Also skip common asset directories to avoid serving HTML for asset requests
  if (req.path.startsWith("/assets") || req.path.startsWith("/Assets")) {
    return next();
  }

  // Serve index.html for all other routes (SPA routing)
  return res.sendFile(path.join(__dirname, "./client/dist", "index.html"));
});

// Sequelize Relations
// Note: Payment.userId refers to student ID from primary-coaching project, NOT a foreign key to User table
// Therefore, no relationship is defined between Payment and User

// Payment belongs to Student (composite foreign key)
// Note: Due to composite keys, constraints are disabled and relationships may need manual handling in queries
Payment.belongsTo(Student, {
  foreignKey: "userId",
  targetKey: "primaryId",
  constraints: false, // Disable foreign key constraint
  as: "student",
});

// Payment belongs to Grade (composite foreign key)
Payment.belongsTo(Grade, {
  foreignKey: "gradePrimaryId",
  targetKey: "primaryId",
  constraints: false,
  as: "grade",
});

// Payment belongs to Shift (composite foreign key)
Payment.belongsTo(Shift, {
  foreignKey: "shiftPrimaryId",
  targetKey: "primaryId",
  constraints: false,
  as: "shift",
});

// Payment belongs to Batch (composite foreign key)
Payment.belongsTo(Batch, {
  foreignKey: "batchPrimaryId",
  targetKey: "primaryId",
  constraints: false,
  as: "batch",
});

// Expense belongs to ExpenseCategory
Expense.belongsTo(ExpenseCategory, {
  foreignKey: "categoryId",
  as: "category",
});

// Revenue belongs to RevenueCategory
Revenue.belongsTo(RevenueCategory, {
  foreignKey: "categoryId",
  as: "category",
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
    // Start CRON job for syncing grades, shifts, and batches (primary)
    const { startSyncCron } = require("./Jobs/syncGradesCron");
    startSyncCron();

    // Start CRON job for syncing students (primary)
    const {
      startSyncCron: startStudentSyncCron,
    } = require("./Jobs/syncStudentsCron");
    startStudentSyncCron();

    // Start CRON job for syncing school grades, shifts, and batches
    const { startSyncCron: startSchoolGradesSyncCron } = require("./Jobs/syncSchoolGradesCron");
    startSchoolGradesSyncCron();

    // Start CRON job for syncing school students
    const {
      startSyncCron: startSchoolStudentSyncCron,
    } = require("./Jobs/syncSchoolStudentsCron");
    startSchoolStudentSyncCron();

    app.listen(port, () => {
      console.log(`Listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.log("Error creating database: ", err);
  });
