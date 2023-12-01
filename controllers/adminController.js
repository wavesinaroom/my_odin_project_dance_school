const {body, validationResult} = require("express-validator");

const Lesson = require("../models/lesson");
const asyncHandler = require("express-async-handler");

exports.index = asyncHandler(async(req,res,next)=>{
  res.render("admin_main");
});

exports.lesson_create_get = asyncHandler(async(req,res,next)=>{
  res.render("admin_create_lesson_form");
});

exports.lesson_create_post= [
  body("number_spots")
    .trim()
    .isLength({min:1})
    .escape()
    .withMessage("Number of spots must be specified.")
    .isNumeric()
    .withMessage("Number of spots must be a number"),

  body("day")
    .trim()
    .escape()
    .isLength({min:1})
    .withMessage("Day must be specified")
    .isString()
    .withMessage("Day has non-alphanumeric characters."),


  body("time")
    .trim()
    .escape()
    .isLength({min:1})
    .withMessage("Time must be specified")
    .isString()
    .withMessage("Time Should be in 12 or 24 hour format"),

  body("teacher")
    .trim()
    .escape()
    .isLength({min:1})
    .withMessage("Teacher's must be specified")
    .isAlpha()
    .withMessage("Teacher's name must not have numbers or special characters"),

  body("style")
    .trim()
    .isLength({min:1})
    .escape()
    .withMessage("Dance style must be specified")
    .isAlpha()
    .withMessage("Dance style must not have numbers or special characters"),

  body("classroom")
    .trim()
    .isLength({min:1})
    .escape()
    .withMessage("Classroom must be specified")
    .isIn(["A", "B"])
    .withMessage("Specify classroom A otherwise B"),

  asyncHandler(async(req,res,next)=>{
    const errors = validationResult(req);

    const lesson = new Lesson({
      number_spots: req.body.number_spots,
      available_spots: req.body.number_spots,
      day: req.body.day,
      time: req.body.time,
      teacher: req.body.teacher,
      style: req.body.style,
      classroom: req.body.classroom
    });

    if(!errors.isEmpty()){
      res.render("admin_create_lesson_form", {errors: errors.array()});
      return;
    }else{
      const classroomTaken = await Lesson.findOne({day: req.body.day, time: req.body.time, classroom: req.body.classroom});

      const teacherBusy = await Lesson.findOne({day: req.body.day, time:req.body.time, teacher: req.body.teacher});
      
      if(teacherBusy)
        res.render("admin_create_teacher_busy", {time:req.body.time, day:req.body.day});
      else if(classroomTaken)
        res.render("admin_create_lesson_exists", {time:req.body.time, day: req.body.day});
      else{
        await lesson.save();
        res.redirect("/admin");
      }
    }

  })
]

exports.lesson_delete_get = asyncHandler(async(req,res,next)=>{
  const lessons = await Lesson.find({}).exec();
  res.render("admin_delete_lessons_table", {lessons: lessons})
});

exports.lesson_delete_post = asyncHandler(async(req,res,next)=>{
  await Lesson.findByIdAndDelete(req.body.lessonid).exec();
  const lessons = await Lesson.find({}).exec();
  res.render("admin_delete_lessons_table", {lessons:lessons});
});

exports.student_sign_up_get = asyncHandler(async(req,res,next)=>{
  res.send("NOT IMPLEMENTED: Create student GET");
});

exports.student_sign_up_post = asyncHandler(async(req,res,next)=>{
  res.send("NOT IMPLEMENTED: Create student POST");
});

exports.student_remove_get = asyncHandler(async(req,res,next)=>{
  res.send("NOT IMPLEMENTED: Delete student GET");
});

exports.student_remove_post = asyncHandler(async(req,res,next)=>{
  res.send("NOT IMPLEMENTED: Delete student POST");
});

exports.student_lesson_book_get = asyncHandler(async(req,res,next)=>{
  res.send("NOT IMPLEMENTED: Book student lesson GET");
});

exports.student_lesson_book_post = asyncHandler(async(req,res,next)=>{
  res.send("NOT IMPLEMENTED: Book student lesson POST");
});

exports.student_lesson_cancel_get = asyncHandler(async(req,res,next)=>{
  res.send("NOT IMPLEMENTED: Remove student lesson GET");
});

exports.student_lesson_cancel_post = asyncHandler(async(req,res,next)=>{
  res.send("NOT IMPLEMENTED: Remove student lesson POST");
});

exports.student_reset_password_get = asyncHandler(async(req, res, nex)=>{
  res.send("NOT IMPLEMENTED: Reset student password GET");
});

exports.student_reset_password_post = asyncHandler(async(req, res, nex)=>{
  res.send("NOT IMPLEMENTED: Reset student password POST");
});
