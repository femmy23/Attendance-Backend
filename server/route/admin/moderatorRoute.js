const express = require("express");
const {
  fetchModerators,
} = require("../../controller/admin/moderatorController");

const router = express.Router();

router.get("/get", fetchModerators);

module.exports = router;
