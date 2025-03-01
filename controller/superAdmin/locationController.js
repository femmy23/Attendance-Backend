const Location = require("../../model/location");
const Branch = require("../../model/branch");
const User = require("../../model/userModel");

const createLocation = async (req, res) => {
  try {
    const { name, region } = req.body;
    const { superAdminId } = req.params;

    const branch = await Branch.find({ superAdmin: superAdminId });

    const newLocation = new Location({
      name,
      region,
      branch: branch[0]?._id,
    });

    await newLocation.save();

    await Branch.updateOne(
      { superAdmin: superAdminId },
      { $push: { locations: newLocation._id } }
    );

    res.status(201).json({
      success: true,
      message: "Location Created Successfully",
      cell: newLocation,
    });
    //
    //
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "An error Occurred",
    });
  }
};

//
//fetch
//

const fetchAllLocation = async (req, res) => {
  try {
    const { superAdminId } = req.params;

    const branch = await Branch.find({ superAdmin: superAdminId }).populate({
      path: "locations",
      populate: { path: "admin" },
    });

    if (!branch) {
      return res.status(404).json({
        success: false,
        message: "Branch not found",
      });
    }

    const branchLocation = branch[0]?.locations;

    res.status(201).json({
      success: true,
      message: "Member Registered Successfully ",
      data: branchLocation,
    });

    //
    //
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error Occurred",
    });
  }
};

//
//edit
//
const editLocation = async (req, res) => {
  try {
    const { admin, name, region } = req.body;
    const { locationId } = req.params;

    const location = await Location.findById(locationId);
    if (!location) {
      return res.status(404).json({
        success: false,
        message: "Location not found",
      });
    }

    if (location.admin !== admin) {
      await User.updateOne({ _id: location.admin }, { location: null });
      await User.updateOne({ _id: location.admin }, { role: "user" });
    }

    location.name = name || location.name;
    location.region = region || location.region;
    location.admin = admin || location.admin;

    await location.save();

    await User.updateOne({ _id: admin }, { location: locationId });
    await User.updateOne({ _id: admin }, { role: "admin" });

    res.status(201).json({
      success: true,
      message: "Location Edited Successfully ",
      data: location,
    });

    //
    //
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error Occurred",
    });
  }
};

//
//delete
//
const deleteLocation = async (req, res) => {
  try {
    const { id } = req.params;

    const location = await Location.findById(id);
    if (!location) {
      return res.status(404).json({
        success: false,
        message: "Location not found",
      });
    }

    await User.updateOne({ _id: location.admin }, { location: null });
    await User.updateOne({ _id: location.admin }, { role: "user" });

    const branch = await Branch.findById(location.branch);
    branch.locations = branch.locations.filter(
      (location) => location._id.toString() !== id
    );
    await branch.save();

    await Location.findByIdAndDelete(id);

    res.status(201).json({
      success: true,
      message: "Deleted Successfully ",
    });

    //
    //
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error Occurred",
    });
  }
};

module.exports = {
  createLocation,
  editLocation,
  deleteLocation,
  fetchAllLocation,
};
