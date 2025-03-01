const express = require("express");
const {
  fetchAttendeeFromCell,
} = require("../../controller/admin/AdminAttendeeController");

router.delete("/get/:cellId", fetchAttendeeFromCell);

module.exports = router;
