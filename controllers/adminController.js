const Lesson = require("../models/lesson");
const asyncHandler = require("express-async-handler");

exports.index = asyncHandler(async(req,res,next)=>{
  res.render("admin_create_lesson");
});

exports.lesson_create_get = asyncHandler(async(req,res,next)=>{
  res.send("NOT IMPLEMENTED: Create lesson GET");
});
exports.lesson_create_post = asyncHandler(async(req,res,next)=>{
  res.send("NOT IMPLEMENTED: Create lesson POST");
});

exports.lesson_delete_get = asyncHandler(async(req,res,next)=>{
  res.send("NOT IMPLEMENTED: Delete lesson GET");
});

exports.lesson_delete_post = asyncHandler(async(req,res,next)=>{
  res.send("NOT IMPLEMENTED: Delete lesson POST");
});

exports.student_create_get = asyncHandler(async(req,res,next)=>{
  res.send("NOT IMPLEMENTED: Create student GET");
});

exports.student_create_post = asyncHandler(async(req,res,next)=>{
  res.send("NOT IMPLEMENTED: Create student POST");
});

exports.student_delete_get = asyncHandler(async(req,res,next)=>{
  res.send("NOT IMPLEMENTED: Delete student GET");
});

exports.student_delete_post = asyncHandler(async(req,res,next)=>{
  res.send("NOT IMPLEMENTED: Delete student POST");
});

exports.student_lesson_book_get = asyncHandler(async(req,res,next)=>{
  res.send("NOT IMPLEMENTED: Book student lesson GET");
});

exports.student_lesson_book_post = asyncHandler(async(req,res,next)=>{
  res.send("NOT IMPLEMENTED: Book student lesson POST");
});

exports.student_lesson_remove_get = asyncHandler(async(req,res,next)=>{
  res.send("NOT IMPLEMENTED: Remove student lesson GET");
});

exports.student_lesson_remove_post = asyncHandler(async(req,res,next)=>{
  res.send("NOT IMPLEMENTED: Remove student lesson POST");
});

exports.student_reset_password_get = asyncHandler(async(req, res, nex)=>{
  res.send("NOT IMPLEMENTED: Reset student password GET");
});

exports.student_reset_password_post = asyncHandler(async(req, res, nex)=>{
  res.send("NOT IMPLEMENTED: Reset student password POST");
});
