const express = require("express");
const {
  createBranch,
  editBranch,
  deleteBranch,
  fetchAllBranch,
} = require("../../controller/superior/branchController");

const router = express.Router();

router.post("/add/:superiorId", createBranch);
router.get("/get/:superiorId", fetchAllBranch);
router.put("/edit/:branchId", editBranch);
router.delete("/delete/:id", deleteBranch);

module.exports = router;
