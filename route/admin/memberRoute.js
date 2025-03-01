const express = require("express");
const {
  fetchMemberByAdmin,
} = require("../../controller/admin/memberController");

const router = express.Router();

router.get("/get/:adminId", fetchMemberByAdmin);

module.exports = router;
