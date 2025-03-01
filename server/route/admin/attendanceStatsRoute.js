const express = require("express");
const {
  AdminAttendanceStats,
} = require("../../controller/admin/attendanceStatsController");

const router = express.Router();

router.get("/get/:adminId", AdminAttendanceStats);

module.exports = router;
