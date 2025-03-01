const express = require("express");
const {
  addMember,
  fetchMember,
} = require("../../controller/moderator/memberController");

const router = express.Router();

// router.post("/add", addMember);
router.get("/get/:moderatorId", fetchMember);

module.exports = router;
