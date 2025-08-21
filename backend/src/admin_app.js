require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const connectDB = require("./config/db");
const routes = require("./routes");

const app = express();
const PORT = process.env.ADMIN_PORT || 3000;

// DB Connection
connectDB();

// Middlewares
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));
app.use("/", routes);

// Ignore favicon
app.get("/favicon.ico", (_, res) => res.sendStatus(204));

// View Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Start Server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
