const express = require("express");
const { fetchCell } = require("../../controller/moderator/cellController");

const router = express.Router();

router.get("/get/:id", fetchCell);

module.exports = router;
