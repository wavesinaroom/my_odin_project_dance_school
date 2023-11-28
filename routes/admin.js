const express = require("express");
const router = express.Router();

const admin_controller = require("../controllers/adminController");

router.get("/", admin_controller.index);

router.get("/lesson/create", admin_controller.lesson_create_get);
router.post("/lesson/create", admin_controller.lesson_create_post);

router.get("/lesson/delete", admin_controller.lesson_delete_get);
router.post("/lesson/delete", admin_controller.lesson_delete_post);

router.get("/student/create", admin_controller.student_create_get);
router.post("/student/create", admin_controller.student_create_post);

router.get("/student/delete", admin_controller.student_delete_get);
router.post("/student/delete", admin_controller.student_delete_post);

router.get("/student/book-lesson", admin_controller.student_lesson_book_get);
router.post("/student/book-lesson", admin_controller.student_lesson_book_post);

router.get("/student/delete-lesson", admin_controller.student_lesson_remove_get);
router.post("/student/delete-lesson", admin_controller.student_lesson_remove_post);

router.get("/student/password-reset", admin_controller.student_reset_password_get);
router.post("/student/password-reset", admin_controller.student_reset_password_post);

module.exports = router;
