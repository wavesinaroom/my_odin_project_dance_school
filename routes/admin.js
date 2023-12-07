const express = require("express");
const router = express.Router();

const admin_controller = require("../controllers/adminController");

router.get("/", admin_controller.index);

router.get("/lesson/create", admin_controller.lesson_create_get);
router.post("/lesson/create", admin_controller.lesson_create_post);

router.get("/lesson/delete", admin_controller.lesson_delete_get);
router.post("/lesson/delete", admin_controller.lesson_delete_post);

router.get("/student/signup", admin_controller.student_sign_up_get);
router.post("/student/signup", admin_controller.student_sign_up_post);

router.get("/student/remove", admin_controller.student_remove_get);
router.post("/student/remove", admin_controller.student_remove_post);

router.get("/student/book-lesson", admin_controller.student_lesson_booking_get);
router.post("/student/book-lesson", admin_controller.student_lesson_booking_post);

router.get("/student/cancel-lesson", admin_controller.student_lesson_cancel_get);
router.post("/student/cancel-lesson", admin_controller.student_lesson_cancel_post);

router.get("/student/password-reset", admin_controller.student_reset_password_get);
router.post("/student/password-reset", admin_controller.student_reset_password_post);

module.exports = router;
