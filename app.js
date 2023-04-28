var createError = require('http-errors');
var express = require('express');
var path = require('path');
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const cookieSession = require("cookie-session");
const flash = require("connect-flash")
const session = require("express-session");
const bodyParser = require("body-parser")
const UserModel = require("./models/user");
const PostModel= require("./models/post")
const mongoose = require("mongoose")
const md5 = require("md5");
const moment = require("moment")

var cookieParser = require('cookie-parser');
var logger = require('morgan');
require("custom-env").env();
(async () => {
  try {
    await mongoose.connect(`mongodb://${process.env.username}:${process.env.password}@localhost:27017/${process.env.database}`);
    console.log("connection to db successful");
  } catch (error) {
    console.log("error", error);
  }

})();
var indexRouter = require('./routes/index');
var postRouter = require('./routes/post');
var usersRouter = require('./routes/users');
// var postsRouter = require('./routes/posts');

const exphbs = require("express-handlebars");
const helpers = require('handlebars-helpers')();
// console.log(helpers)
var app = express();


const hbs = exphbs.create({
  extname: '.hbs',
  defaultLayout: false,
  helpers: {
    ...helpers,
    formatDate: function (createdAt,formatDate) {
      return moment(createdAt).format(formatDate); 
    }
  }

})
app.set('views', path.join(__dirname, 'views'));
// view engine setup
app.set('view engine', 'hbs');
app.engine("hbs", hbs.engine);

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieSession({
  secret: "session",
  key: "abhH4re5Uf4Rd0KnddSsdf05f3V",
}));

app.use(session({
  secret: 'abhH4re5Uf4Rd0KnddS05sdff3V',
  resave: false,
  maxAge: 24 * 60 * 60 * 1000,
  saveUninitialized: true,
  cookie: { secure: true }
}));
app.use(cookieParser());

app.use(passport.initialize());
app.use(passport.session());
app.use(function (req, res, next) {
 
  res.locals.user = req.user;
  next();
});
// // require('./middlewares/passport')(passport);
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
},
  /**function for login user
   * @param {string} email
   * @param {string} password
   * @param {Function} done
   * @return {[type]}
  */
  function (req, email, password, done) {
    // console.log("username-----------------");
    // console.log(email);
    // console.log(password);
    UserModel.findOne({
      email: email,
      password: md5(password)
    },
       {
        _id: 1,
              firstname: 1,
              lastname: 1,
              gender: 1,
              email: 1,
              password: 1,
              profile : 1
            }
    ).then(async function (user) {
      // console.log("+++++++");
      // console.log(user,"jjnjjnnjj");
      // if user not found
      if (!user) {
        return done(null, false, {
          message: 'Please enter valid login details'
        });
      }

      else {
        // console.log("================kjlkm.,m==============success=============");
        // console.log(user,"kkkkkkkkk");
        return done(null, user);
      }
      // handle catch 
    }).catch(function (err) {
      // console.log(err);
      return done(null, false, {
        message: 'Please enter valid login details'
      });
    });
  }));

passport.serializeUser(function (user, done) {
  // console.log(user);
  console.log("serializeUser");
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  try {
    console.log("deserializeUser");
    done(null, user);
  } catch (error) {
    console.log(error);
  }
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());
app.use(function (req, res, next) {
  let error = req.flash("error");
  let success = req.flash("success");
  if (error.length > 0) {
    res.locals.flash = {
      type: 'error',
      message: error
    }
  }
  if (success.length > 0) {
    res.locals.flash = {
      type: 'success',
      message: success
    }
  }
  return next()
});

app.use('/', indexRouter);


app.use(function isLoggedIn(req, res, next) {
  
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
})
app.use('/', usersRouter);
// app.use("/timeline",timelineRouter);
app.use("/post",postRouter);
// app.use('/',postsRouter)




// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
