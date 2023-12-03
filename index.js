const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const multer = require("multer");

const PORT = 5000;
const authRoutes = require("./routes/auth");

const { sequelize, connectToDb } = require("./db");
app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use("/api", authRoutes);

app.listen(PORT, () => {
  console.log("Server is Running on PORT 5000");
  connectToDb();
});
