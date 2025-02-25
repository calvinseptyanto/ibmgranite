//////////////////////////////////////////////////////
// INCLUDES
//////////////////////////////////////////////////////
const express = require("express");
const cors = require("cors");

//////////////////////////////////////////////////////
// CREATE APP
//////////////////////////////////////////////////////
const app = express();
app.use(cors());

//////////////////////////////////////////////////////
// USES
//////////////////////////////////////////////////////
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//////////////////////////////////////////////////////
// SETUP ROUTES
//////////////////////////////////////////////////////
app.get("/", (req, res) => {
  res.send("I am Alive!");
});

const mainRoutes = require("./routes/mainRoutes");

app.use("/", mainRoutes);

//////////////////////////////////////////////////////
// SETUP STATIC FILES
//////////////////////////////////////////////////////
app.use("/", express.static('public'));

//////////////////////////////////////////////////////
// EXPORT APP
//////////////////////////////////////////////////////
module.exports = app;
