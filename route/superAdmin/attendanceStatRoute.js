const express = require("express");
const {
  SuperAdminAttendanceStats,
} = require("../../controller/superAdmin/attendanceStatController");

const router = express.Router();

router.get("/get/:superAdminId", SuperAdminAttendanceStats);

module.exports = router;
