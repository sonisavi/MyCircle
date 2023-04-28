var express = require('express');
var router = express.Router();
const md5 = require("md5");
const session = require("express-session")

const flash = require("connect-flash")
const passport = require("passport")
const UserModel = require("../models/user")
/* GET home page. */
router.get('/register', function (req, res, next) {
  res.render('register');
});

router.get("/login", function (req, res, next) {
  res.render("login")
})
router.get("/logout", function(req, res,next) {
  console.log("logout");
  req.logOut();
  req.session=null;
  res.redirect("/login")

});

router.get("/validate-email", async (req, res) => {
  try {
    const { email } = req.query;
    let checkEmail = await UserModel.countDocuments({ email: email });
    console.log(checkEmail);
    res.send(checkEmail < 1 ? true : false);
  } catch (error) {
    res.send(false);
  }


})


router.post("/register", async (req, res, next) => {
  try {


    let newUser = await UserModel.create(
      {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        gender: req.body.gender,
        email: req.body.email,
        password: md5(req.body.password)
      }
    );
    // req.logIn(newUser, function (err) {
    //   if (err) {
    //     console.log(err);
    //   }
      req.flash('success', 'Successfully registered.')
      return res.redirect('/login')
    // });


  } catch (err) {
    console.log("error", err.message);
  }
})

router.post('/login',function (req, res, next) {
  try {
    console.log(req.user);
    passport.authenticate('local', function (err, user, info){
      // console.log(user,"user");
      console.log("au------------");
      // console.log(user)
      if (err) {
        console.log("error",err.message);
        return next(err)
      }
      if (!user) {
        // *** Display message without using flash option
        // re-render the login form with a message
        // console.log("ejhsefrjhefrjhjhe");
        req.flash('error', 'Please provide valid login details')
        return res.redirect('/login');
      }
      req.logIn(user, function (err) {
        if (err) {
          return next(err);
        }
        // console.log("sderer4wererert");
       res.redirect("/post") 
      });
    })(req, res, next);

  } catch (error) {
    console.log("error", error.message);
  }
})

module.exports = router;
