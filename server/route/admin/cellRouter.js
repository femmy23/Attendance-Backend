const express = require("express");
const {
  createCell,
  fetchAllCell,
  editCell,
  deleteCell,
} = require("../../controller/admin/cellController");

const router = express.Router();

router.post("/add/:id", createCell);
router.get("/get/:id", fetchAllCell);
router.put("/edit/:id", editCell);
router.delete("/delete/:id", deleteCell);

module.exports = router;
