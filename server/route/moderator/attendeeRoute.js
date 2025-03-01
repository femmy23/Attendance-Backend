const express = require("express");
const {
  addAttendee,
  editAttendee,
  fetchAllAttendee,
  deleteAttendee,
  enrollMembership,
} = require("../../controller/moderator/attendeeController");

const router = express.Router();

router.post("/add/:id", addAttendee);
router.get("/get/:id", fetchAllAttendee);
router.put("/edit/:id", editAttendee);
router.put("/enroll/:id", enrollMembership);
router.delete("/delete/:id", deleteAttendee);

module.exports = router;
