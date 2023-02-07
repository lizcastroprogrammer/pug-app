const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User");
const { check, body, validationResult } = require("express-validator");

const userRoutes = (app) => {
  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(function (user, done) {
    done(null, user);
  });

  passport.use(
    new LocalStrategy(function (username, password, done) {
      User.findOne({ username: username }, function (err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false);
        }
        if (!user.validPassword(password)) {
          return done(null, false);
        }
        return done(null, user);
      });
    })
  );

  app.get("/login", function (req, res) {
    res.render("login");
  });

  //user should be able to post to the login endpoint with a username and password and be given a jwt token using passportjs
  app.post(
    "/login",
    check("username").not().isEmpty().withMessage("Username is required"),
    body("password")
      .isLength({ min: 5 })
      .withMessage("Password must be at least 5 characters long"),
    (req, res, next) => {
      //validate the user input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        req.flash("error", "Login failed! Please try again.");
        res.redirect("/login");
        return;
      }

      next();
    },
    passport.authenticate("local", {
      failureRedirect: "/login",
    }),
    function (req, res) {
      console.log("success");
      req.flash("success", "Login successful!");
      res.redirect("/");
    }
  );

  app.get("/logout", function (req, res) {
    req.session.destroy(function (err) {
      res.redirect("/"); //Inside a callback… bulletproof!
    });
  });

  app.get("/register", (req, res) => {
    res.render("register", { title: "Register" });
  });

  app.post(
    "/register",
    check("username").not().isEmpty().withMessage("Username is required"),
    body("email").isEmail().normalizeEmail(),
    body("password")
      .isLength({ min: 5 })
      .withMessage("Password must be at least 5 characters long"),
    (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log(errors);
        req.flash("error", "Registration failed! Please try again.");
        res.redirect("/register");
        return;
      }
      const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
      });
      user.save((err) => {
        if (err) {
          console.log(err);
          req.flash("error", "Registration failed! Please try again.");
          return;
        }
        req.flash("success", "Registration successful! Please login.");
        res.redirect("/login");
      });
    }
  );
};

module.exports = {userRoutes};
