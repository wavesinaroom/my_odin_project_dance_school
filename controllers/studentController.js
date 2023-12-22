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
    const message = {text: "Lessons is already booked"};
    res.render("student_lesson_booking_form", {message: message, lessons:lessons});
    return;
  }
  
  if(lesson){
    await User.findOneAndUpdate({_id: req.session.passport.user}, {$push: {lessons:lesson}}); 
    await Lesson.findByIdAndUpdate(req.body.lessonid, {$inc:{booked_spots:1}});
    const updated = await Lesson.find({});
    res.render("student_lesson_booking_form", {lessons:updated});
    return;
  }

  res.render("student_lesson_booking_form",{lessons: lessons});
});

exports.lesson_cancel_get = asyncHandler(async(req,res,next)=>{
  if(typeof(req.session.passport)!== 'undefined'){
    const booked = await User.findOne({_id: req.session.passport.user}, {lessons:1}).populate("lessons");
    res.render("student_lesson_cancel_form", {booked: booked.lessons});
  }else
    res.redirect("/login")
});

exports.lesson_cancel_post = asyncHandler(async(req,res,next)=>{
  const booked = await User.findOne({_id: req.session.passport.user}, {lessons:1}).populate("lessons");
  await User.findOneAndUpdate({_id: req.session.passport.user}, {$pull:{lessons: req.body.lessonid}});
  await Lesson.findByIdAndUpdate(req.body.lessonid, {$inc:{booked_spots: -1}});

  res.render("student_lesson_cancel_form", {lessons: booked.lessons});
});

exports.password_update_get = asyncHandler(async(req,res,next)=>{
  if(typeof(req.session.passport)!== 'undefined')
    res.render("student_password_update_form");
  else
    res.redirect("/login")
})

exports.password_update_post = asyncHandler(async(req,res,next)=>{
  body("old_password")
    .trim()
    .escape()
    .isLength({min: 1})
    .withMessage("Old password is required")

  const errors = validationResult(req);

  if(!errors.isEmpty()){
    res.render("student_password_update_form", {errors: errors.array()});
  }
    
  const student = await User.findOne({_id: req.session.passport.user});
  if(student.password===req.body.old_password){
    await User.findOneAndUpdate({_id: req.session.passport.user}, {password:req.body.new_password});
    res.redirect("/student");
    return;
  }else{
    const message = {text: "Old password is not correct"};
    res.render("student_password_update_form", {message: message})
  }
});
