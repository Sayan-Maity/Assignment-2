const express = require("express");
var app = express();
const dotenv = require("dotenv");
dotenv.config();
const PORT = process.env.PORT || 5000;
const cors = require("cors");
const bodyParser = require("body-parser");
const allRoutes = require("./routes/AllRoutes");

// middlewares
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api", allRoutes);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(PORT, () => console.log("Server is running at port " + PORT));
