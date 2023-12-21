const {body, validationResult} = require("express-validator");
const User = require("../models/users");
const Lesson = require("../models/lesson");
const asyncHandler = require("express-async-handler");

exports.index = asyncHandler(async(req,res,next)=>{
  if(typeof(req.session.passport)!== 'undefined')
    res.render("student_main");
  else
    res.redirect("/login")
});

exports.lesson_booking_get = asyncHandler(async(req,res,next)=>{
  const lessons = await Lesson.find({});
  if(typeof(req.session.passport)!== 'undefined')
    res.render("student_lesson_booking_form", {lessons: lessons});
  else
    res.redirect("/login")
});

exports.lesson_booking_post = asyncHandler(async(req,res,next)=>{
  const lessons = await Lesson.find({}).exec();
  const lesson = await Lesson.findById(req.body.lessonid);
  const existingLesson = await User.findOne({_id: req.session.passport.user, lessons: lesson});

  if(existingLesson){
    res.send("Lesson is already booked");
    return;
  }
  
  if(lesson){
    await User.findOneAndUpdate({_id: req.session.passport.user}, {$push: {lessons:lesson}}); 
    await Lesson.findByIdAndUpdate(req.body.lessonid, {$inc:{booked_spots:1}});
    res.redirect("/student")
    return;
  }

  res.render("student_lesson_booking_form",{lessons: lessons});
});

exports.lesson_cancel_get = asyncHandler(async(req,res,next)=>{
  if(typeof(req.session.passport)!== 'undefined'){
    const booked = await User.findOne({_id: req.session.passport.user}, {lessons:1}).populate("lessons");
    console.log(booked);
    res.render("student_lesson_cancel_form", {booked: booked.lessons});
  }else
    res.redirect("/login")
});

exports.lesson_cancel_post = asyncHandler(async(req,res,next)=>{
  body("name")
  .trim()
  .isLength({min:1})
  .escape()
  .withMessage("Name is required");

  body("surname")
  .trim()
  .isLength({min:1})
  .escape()
  .withMessage("Surname is required");

  const errors = validationResult(req);
  if(!errors.isEmpty()){
    res.render("student_lesson_cancel_form", {errors: errors.array()})
    return;
  }

  const student = await User.findOne({name: req.body.name, surname: req.body.surname});

  if(!student){
    res.send("User not found");
    return;
  }

  if(req.body.lessonid){
    await User.findOneAndUpdate({name: req.body.name, surname: req.body.surname}, {$pull:{lessons: req.body.lessonid}});
    await Lesson.findByIdAndUpdate(req.body.lessonid, {$inc:{booked_spots: -1}});
    res.redirect("/admin");
    return;
  }

  res.render("student_lesson_cancel_form", {name:req.body.name, surname: req.body.surname, lessons: booked.lessons});
});

exports.password_update_get = asyncHandler(async(req,res,next)=>{
  if(typeof(req.session.passport)!== 'undefined')
    res.render("student_password_update_form");
  else
    res.redirect("/login")
})

exports.password_update_post = asyncHandler(async(req,res,next)=>{
  body("name")
  .trim()
  .isLength({min:1})
  .escape()
  .withMessage("Name is required");

  body("surname")
  .trim()
  .isLength({min:1})
  .escape()
  .withMessage("Surname is required");

  const errors = validationResult(req);
  if(!errors.isEmpty()){
    res.render("student_password_update_form", {errors: errors.array()});
    return;
  }
  
  const student = await User.findOne({username:req.body.username})

  if(!student){
    res.send("User not found");
    return;
  }

  if(req.body.old_password&&student.password===req.body.old_password){
      await User.findOneAndUpdate({username: req.body.username}, {password:req.body.new_password});
      res.redirect("/student");
      return;
  }
  res.render("student_password_update_form", {username: req.body.username})
})
