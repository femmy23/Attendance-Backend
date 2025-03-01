const express = require("express");
const {
  fetchLocationById,
} = require("../../controller/superior/locationController");

const router = express.Router();

router.get("/get/:branchId", fetchLocationById);

module.exports = router;
