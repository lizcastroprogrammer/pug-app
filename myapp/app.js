var express = require("express");
var app = express();
var mongoose = require("mongoose");
const flash = require("connect-flash");
const pug = require("pug");
const path = require("path");
const session = require("express-session");
const bodyParser = require("body-parser");
const { userRoutes } = require("./routes/user-routes");
const { recipeRoutes } = require("./routes/recipe-routes");
const { homeRoutes } = require("./routes/home-routes");
require("dotenv").config();

app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

mongoose.connect(process.env.DBURL, {
  useNewUrlParser: false,
  useUnifiedTopology: true,
}); //connect to the database

userRoutes(app);
recipeRoutes(app);
homeRoutes(app);

app.listen(3000, function () {
  console.log("Example app listening on port 3000!");
});
