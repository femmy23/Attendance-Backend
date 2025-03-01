const express = require("express");
const {
  createHeadquarter,
} = require("../../controller/superior/headquarterController");

const router = express.Router();

router.post("/add/:superiorId", createHeadquarter);
module.exports = router;
