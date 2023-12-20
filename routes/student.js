const express = require("express");
const router = express.Router();

const student_controller = require("../controllers/studentController");

router.get("/", student_controller.index);

router.get("/lesson-book", student_controller.lesson_booking_get);
router.post("/lesson-book", student_controller.lesson_booking_post);

router.get("/lesson-cancel", student_controller.lesson_cancel_get);
router.post("/lesson-cancel", student_controller.lesson_cancel_post);

router.get("/password-update", student_controller.password_update_get);
router.post("/password-update", student_controller.password_update_post);

module.exports = router;
