const express = require("express");
const {
  addAttendance,
  fetchAttendance,
} = require("../../controller/moderator/attendanceController");

const router = express.Router();

router.post("/add", addAttendance);
router.get("/get/:modId", fetchAttendance);

module.exports = router;
