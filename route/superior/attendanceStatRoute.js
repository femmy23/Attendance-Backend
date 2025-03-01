const express = require("express");
const {
  SuperiorAttendanceStats,
} = require("../../controller/superior/attendanceStatController");

const router = express.Router();

router.get("/get/:superiorId", SuperiorAttendanceStats);

module.exports = router;
