const express = require('express');
const router = express.Router();
const User = require("../models/user.js"); 
const wrapAsync = require('../utils/wrapAsync.js');
const passport = require('passport');
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");



router
.route("/signup")
.get( userController.rendersignupForm)
.post(wrapAsync (userController.signup));



router
.route("/login")
.get( userController.renderLoginForm)
// .post(  
//   saveRedirectUrl,
//   passport.authenticate("local", {
//     failureRedirect: "/login",
//     failureFlash: true
//   }), userController.login  
// );

router.post("/login", saveRedirectUrl, (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      req.flash("error", info.message);
      return res.redirect("/login");
    }

    req.logIn(user, (err) => {
      if (err) return next(err);

      req.flash("success", "Welcome to Wanderlust. You are logged in");
      let redirectUrl = res.locals.redirectUrl || "/listings";
      return res.redirect(redirectUrl);
    });
  })(req, res, next);
});


router.get("/logout",userController.logout);


module.exports = router;

