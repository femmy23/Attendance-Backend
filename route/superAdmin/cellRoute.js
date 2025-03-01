const express = require("express");
const { fetchCellById } = require("../../controller/superAdmin/cellController");

const router = express.Router();

router.get("/get/:locationId", fetchCellById);

module.exports = router;
