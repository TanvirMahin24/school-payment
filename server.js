const express = require("express");
require("dotenv").config();
const cors = require("cors");
var morgan = require("morgan");
const sequelize = require("./Utils/database");
const path = require("path");
const passport = require("passport");
const { Payment, User } = require("./Model");
require("./Utils/passport");

// INITIALIZE APP
const app = express();
const port = process.env.PORT || 5000;

//Initializing the middlewares
app.use(express.json({ extended: false }));
app.use(express.urlencoded({ extended: true }));

// Cors;
app.use(
  cors({
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
      "Access-Control-Allow-Origin",
      "Access-Control-Allow-Headers",
      "Access-Control-Allow-Methods",
    ],
    methods: ["GET", "PUT", "POST", "DELETE", "PATCH"],
  })
);

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);
app.use(passport.initialize());

app.use(express.static(path.join(__dirname, "./client/dist")));

app.use("/api", require("./Routes/Auth"));
app.use("/api/payment", require("./Routes/Payment"));

app.get("/*", (req, res) => {
  return res.sendFile(path.join(__dirname, "./client/dist", "index.html"));
});

// Sequelize Relations
User.hasMany(Payment);
Payment.belongsTo(User);

// Sequelize Sync
sequelize
  .sync({ force: false })
  .then(() => {
    app.listen(port, () => {
      console.log(`Listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.log("Error creating database: ", err);
  });

