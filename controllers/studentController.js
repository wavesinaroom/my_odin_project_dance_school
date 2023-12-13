const {body, validationResult} = require("express-validator");
const Student = require("../models/student");
const Lesson = require("../models/lesson");
const asyncHandler = require("express-async-handler");

exports.index = asyncHandler(async(req,res,next)=>{
  res.render("student_main");
});

exports.lesson_booking_get = asyncHandler(async(req,res,next)=>{
  res.render("student_lesson_booking_form");
});

exports.lesson_booking_post = asyncHandler(async(req,res,next)=>{
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
    res.render("student_lesson_booking_form", {error:errors.array()});
    return;
  }

  const student = await Student.findOne({name: req.body.name, surname: req.body.surname}).exec(); 
  const lessons = await Lesson.find({}).exec();
  const lesson = await Lesson.findById(req.body.lessonid);
  const existingLesson = await Student.findOne({name: req.body.name, surname:req.body.surname, lessons: lesson})

  if(!student){
    res.send("Student not found");
    return;
  }

  if(existingLesson){
    res.send("Lesson is already booked");
    return;
  }
  
  if(req.body.lessonid){
    await Student.findOneAndUpdate({name: req.body.name, surname: req.body.surname}, {$push: {lessons:lesson}}); 
    await Lesson.findByIdAndUpdate(req.body.lessonid, {$inc:{booked_spots:1}});
    res.redirect("/student")
    return;
  }

  res.render("student_lesson_booking_form",{name:req.body.name,surname:req.body.surname, lessons: lessons});
});

exports.lesson_cancel_get = asyncHandler(async(req,res,next)=>{
  res.send("NOT IMPLEMENTED: student lesson cancel GET");
});

exports.lesson_cancel_post = asyncHandler(async(req,res,next)=>{
  res.send("NOT IMPLEMENTED: student lesson cancel POST");
});

exports.password_update_get = asyncHandler(async(req,res,next)=>{
  res.send("NOT IMPLEMENTED: student password update GET");
})

exports.password_update_post = asyncHandler(async(req,res,next)=>{
  res.send("NOT IMPLEMENTED: student password update POST");
})
