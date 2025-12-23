const express = require("express");
require("dotenv").config();
const cors = require("cors");
var morgan = require("morgan");
const sequelize = require("./Utils/database");
const path = require("path");
const passport = require("passport");
const { Payment, User, Grade, Shift, Batch } = require("./Model");
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
app.use("/api/external", externalCors, require("./Routes/ExternalPayment"));

app.get("/*", (req, res) => {
  return res.sendFile(path.join(__dirname, "./client/dist", "index.html"));
});

// Sequelize Relations
// Note: Payment.userId refers to student ID from primary-coaching project, NOT a foreign key to User table
// Therefore, no relationship is defined between Payment and User

// Note: Grade, Shift, Batch use composite primary keys (tenant, primaryId)
// Sequelize doesn't fully support composite foreign keys in associations,
// so relationships will be handled manually in queries using where clauses
// Example: { where: { gradeTenant: 'primary', gradePrimaryId: 1 } }

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

    app.listen(port, () => {
      console.log(`Listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.log("Error creating database: ", err);
  });
