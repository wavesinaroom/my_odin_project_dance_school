const {body, validationResult} = require("express-validator");
const Student = require("../models/student");
const Lesson = require("../models/lesson");
const asyncHandler = require("express-async-handler");

exports.index = asyncHandler(async(req,res,next)=>{
  res.render("student_main");
});

exports.lesson_booking_get = asyncHandler(async(req,res,next)=>{
  res.send("NOT IMPLEMENTED: studentes lesson booking GET");
});

exports.lesson_booking_post = asyncHandler(async(req,res,next)=>{
  res.send("NOT IMPLEMENTED: student lesson booking POST");
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
