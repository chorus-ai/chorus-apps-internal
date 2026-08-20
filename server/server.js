const express = require("express");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
const db = require("./models");
const routes = require("./routes");
const swaggerUI = require("swagger-ui-express");
const swaggerDocument = require(`./swagger`);
const createError = require("http-errors");
const authMiddleware = require("./middleware/auth");

require('dotenv').config();
const PORT = process.env.PORT || 8080;
const NODE_ENV = process.env.NODE_ENV || "development";

app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sync every Sequelize instance exposed on `db` (db.sequelize_app, _omop,
// etc.). Adding or removing an instance in models/index.js is enough — no
// list to maintain here.
const sequelizes = Object.entries(db)
  .filter(([k, v]) => k.startsWith("sequelize_") && v && typeof v.sync === "function");

Promise.all(sequelizes.map(([_, s]) => s.sync()))
  .then(() => console.log(`Synced db: ${sequelizes.map(([k]) => k).join(", ")}`))
  .catch((err) => console.log("Failed to sync db: " + err.message));

app.use(express.static(path.join(__dirname, "../client/build")));

app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// Public paths that don't require JWT authentication
const publicPaths = [
  "/auth/login",
  "/auth/signup",
  "/auth/github-login",
  "/auth/azure-login",
  "/auth/azure-callback",
  "/auth/logout",
  "/auth/resetPassword",
];

// Apply auth middleware to all /api routes except public ones
app.use("/api", (req, res, next) => {
  if (publicPaths.some((p) => req.path === p || req.path.startsWith(p + "/"))) {
    return next();
  }
  return authMiddleware(req, res, next);
});

app.use("/api", routes);

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.status(err.status || 500).json({
    status: "error",
    err: {
      message: err.message,
    },
  });
});

const server = app.listen(PORT, () => {
    console.log(`🚀 Server is running in ${NODE_ENV} mode on port ${PORT}`);
});

function handleShutdownGracefully() {
  console.info("closing server gracefully...");
  server.close(() => {
    console.info("server closed.");
    process.exit(0); // if required
  });
}
process.on("SIGINT", handleShutdownGracefully);
process.on("SIGTERM", handleShutdownGracefully);
process.on("SIGHUP", handleShutdownGracefully);
