const {body, validationResult} = require("express-validator");
const Lesson = require("../models/lesson");
const User = require("../models/users");
const asyncHandler = require("express-async-handler");

exports.index = asyncHandler(async(req,res,next)=>{
  if(typeof(req.session.passport) !== 'undefined')
    res.render("admin_main");
  else
    res.redirect('/login')
});

exports.lesson_create_get = asyncHandler(async(req,res,next)=>{
  if(typeof(req.session.passport) !== 'undefined')
    res.render("admin_create_lesson_form");
  else
    res.redirect('/login')
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
    .withMessage("Teacher's must be specified"),

  body("style")
    .trim()
    .isLength({min:1})
    .escape()
    .withMessage("Dance style must be specified"),

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
      booked_spots: "0",
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
      
      if(teacherBusy){
        const feedback = {message: `Can't scheduled teacher at ${req.body.time} on ${req.body.day}`};
        res.render("admin_create_lesson_form", {feedback: feedback});
      }
      else if(classroomTaken){
        const feedback = {message: `Classroom is not available at ${req.body.time} on ${req.body.day}`};
        res.render("admin_create_lesson_form", {feedback: feedback});
      }
      else{
        await lesson.save();
        res.render("admin_create_lesson_form");
      }
    }

  })
]

exports.lesson_delete_get = asyncHandler(async(req,res,next)=>{
  if(typeof(req.session.passport) !== 'undefined'){
    const lessons = await Lesson.find({}).exec();
    res.render("admin_delete_lessons_table", {lessons: lessons})
    res.redirect("/admin");
  }else
    res.redirect('/login')
});

exports.lesson_delete_post = asyncHandler(async(req,res,next)=>{
  await Lesson.findByIdAndDelete(req.body.lessonid).exec();
  const lessons = await Lesson.find({}).exec();
  res.render("admin_delete_lessons_table", {lessons:lessons});
});

exports.student_sign_up_get = asyncHandler(async(req,res,next)=>{
  if(typeof(req.session.passport) !== 'undefined')
    res.render("admin_sign_up_student_form");
  else
    res.redirect('/login')
});

exports.student_sign_up_post = asyncHandler(async(req,res,next)=>{
  body("name")
    .trim()
    .isLength({min:1})
    .escape()
    .withMessage("Name must not be empty");

  body("surname")
    .trim()
    .isLength({min:1})
    .escape()
    .withMessage("Surname must not be empty");

  body("username")
    .trim()
    .isLength({min:1})
    .escape()
    .withMessage("username must not be empty");

    const errors = validationResult(req);

    const student = new User({
      name: req.body.name,
      surname: req.body.surname,
      username: req.body.username,
      password: 1234
    });

    if(!errors.isEmpty()){
      res.render("admin_sign_up_student_form", {errors: errors.array()});
    }

    const existingUser = await User.findOne({name: req.body.name, surname: req.body.surname, username: req.body.username}).exec();

    if(existingUser){
      const feedback = {message: 'Student already exists'};
      res.render("admin_sign_up_student_form", {feedback: feedback});
      return;
    }

    await student.save();
    res.redirect("/admin");
});

exports.student_remove_get = asyncHandler(async(req,res,next)=>{
  if(typeof(req.session.passport) !== 'undefined')
    res.render("admin_remove_student_form");
  else
    res.redirect('/login')
});

exports.student_remove_post = asyncHandler(async(req,res,next)=>{
  if(req.body.resultid){
    await User.findByIdAndDelete(req.body.resultid).exec();
    res.redirect("/admin")
    return;
  }else{
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
      const result = await User.findOne({name: req.body.name, surname: req.body.surname}).exec();

      if(!errors.isEmpty())
        res.render("admin_remove_student_form", {errors: errors.array()});
else{
        res.render("admin_remove_student_form", {result: result});
      }
    }
  }),

exports.student_lesson_booking_get = asyncHandler(async(req,res,next)=>{
  if(typeof(req.session.passport) !== 'undefined'){
    const lessons = await Lesson.find({}).exec();
    res.render("admin_student_lesson_booking", {lessons:lessons});
  }else
    res.redirect('/login')
});

exports.student_lesson_booking_post = asyncHandler(async(req,res,next)=>{
    body("name")
      .trim()
      .isLength()
      .escape()
      .withMessage("Name is required");

    body('surname')
      .trim()
      .isLength()
      .escape()
      .withMessage("Surname is required");

    body('style')
      .trim()
      .isLength()
      .escape()
      .withMessage("Style is required")

  const errors = validationResult(req);

  if(!errors.isEmpty()){
    res.render("admin_student_lesson_booking", {errors: errors.array()});
  }
  
  const lesson = await Lesson.findOne({style: req.body.style}).exec();
  const booked = await User.findOne({name: req.body.name, surname: req.body.surname, lessons: lesson}).exec();

  if(booked){
    const feedback = {message: "Lesson is already booked"}
    res.render("admin_student_lesson_booking", {feedback: feedback});
    return;
  }else{
    if(lesson.booked_spots<lesson.number_spots){
      await User.findOneAndUpdate({name: req.body.name, surname: req.body.surname,$push:{lessons: lesson}}).exec();
      await Lesson.findByIdAndUpdate(lesson._id, {$inc: {booked_spots: 1}}).exec();
      res.render("admin_student_lesson_booking");
      return;
    }else{
      const feedback = {message: "Lesson is not available"};
      res.render("admin_student_lesson_booking", {feedback: feedback});
      return;
    }
  }
  
});

exports.student_lesson_cancel_get = asyncHandler(async(req,res,next)=>{
  if(typeof(req.session.passport) !== 'undefined')
    res.render("admin_lesson_cancel_form");
  else
    res.redirect('/login')
});

exports.student_lesson_cancel_post = asyncHandler(async(req,res,next)=>{

  body("name")
    .trim()
    .isLength()
    .escape()
    .withMessage("Name is required");

  body("surname")
    .trim()
    .isLength()
    .escape()
    .withMessage("Surname is required");

  const errors = validationResult(req);

  if(!errors.isEmpty())
    res.render("admin_lesson_cancel_form", {errors: errors.array()});

  const booked = await User.findOne({name: req.body.name, surname: req.body.surname}, {lessons:1}).populate("lessons").exec();

  if(req.body.lessonid){
    await Lesson.findByIdAndUpdate(req.body.lessonid, {$inc: {booked_spots:-1}}).exec();
    await User.findOneAndUpdate({name:req.body.name, surname:req.body.surname}, {$pull:{lessons:req.body.lessonid}}).exec();
    res.redirect("/admin");
    return;
  }

  res.render("admin_lesson_cancel_form", {lessons:booked.lessons, name:req.body.name, surname:req.body.surname});

});

exports.student_reset_password_get = asyncHandler(async(req, res, nex)=>{
  if(typeof(req.session.passport) !== 'undefined')
    res.render("admin_password_update_form");
  else
    res.redirect('/login')
});

exports.student_reset_password_post = asyncHandler(async(req, res, nex)=>{
  body("name")
    .trim()
    .isLength()
    .escape()
    .withMessage("Name is required");

  body("surname")
    .trim()
    .isLength()
    .escape()
    .withMessage("Surname is required");

  const errors = validationResult(req);

  if(!errors.isEmpty())
    res.render("admin_password_update_form", {errors: errors.array()});

  const student = await User.findOne({name:req.body.name, surname:req.body.surname}).exec();
  if(!student){
    res.send("User name or surname is invalid");
    return;
  }

  if(req.body.old===student.password){
    await User.findOneAndUpdate({name: req.body.name, surname: req.body.surname}, {password: req.body.password}).exec();
    res.redirect("/admin");
    return;
  }

  res.render("admin_password_update_form", {name:req.body.name, surname:req.body.surname});

});
