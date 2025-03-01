const express = require("express");
const {
  createLocation,
  editLocation,
  deleteLocation,
  fetchAllLocation,
} = require("../../controller/superAdmin/locationController");

const router = express.Router();

router.post("/add/:superAdminId", createLocation);
router.get("/get/:superAdminId", fetchAllLocation);
router.put("/edit/:locationId", editLocation);
router.delete("/delete/:id", deleteLocation);

module.exports = router;
