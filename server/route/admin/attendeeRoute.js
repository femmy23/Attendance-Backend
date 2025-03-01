const express = require("express");
const {
  fetchAttendeeByCellId,
} = require("../../controller/admin/attendeeController");

const router = express.Router();

router.get("/get/:cellId", fetchAttendeeByCellId);

module.exports = router;
