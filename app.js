var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const adminRouter = require('./routes/admin');
const studentRouter = require('./routes/student');
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
require("dotenv").config();
const mongoDB = process.env.MONGODB_URI
const session = require("express-session");
const passport = require("passport"); 
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/users");
const compression = require("compression");
const helmet = require("helmet");
const RateLimit = require("express-rate-limit");
const limiter = RateLimit({
  windowMs: 1*60*1000,
  max: 20,
});

var app = express();
main().catch((err) => console.log(err));
async function main(){
  await mongoose.connect(mongoDB);
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({secret: "cats", resave: false, saveUninitialized: true, cookie:{maxAge: 300000}}));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.urlencoded({extended:false}));

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "script-src": ["'self'", "code.jquery.com", "cdn.jsdelivr.net"],
    },
  }),
);

app.use(limiter);

passport.use(
  new LocalStrategy(async(username, password, done)=>{
    try{
      const user = await User.findOne({username: username});
      if(!user){
        return done(null, false, {message: "Incorrect username"});
      };
      if(user.password !== password){
        return done(null, false, {message: "Incorrect password"});
      };
      return done(null, user);
    }catch(err){
      return done(err);
    };
  })
)

passport.serializeUser((user, done)=>{
  done(null, user.id);
});

passport.deserializeUser(async(id, done)=>{
  try{
    const user = await User.findById(id);
    done(null, user);
  }catch(err){
    done(err);
  };
});

app.use("/", indexRouter)
app.use('/admin', adminRouter);
app.use('/student', studentRouter);

app.get("/login",(req,res)=>{
  res.render("login")
});

app.post("/login",
  passport.authenticate("local", {
    failureRedirect: "/",
  }),(req,res)=>{
    if(req.body.username === "admin"){
      res.redirect("/admin")
      return;
    }
    res.redirect("/student");
  }
)
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
