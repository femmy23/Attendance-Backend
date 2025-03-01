const Cell = require("../../model/cell");
const Location = require("../../model/location");
const User = require("../../model/userModel");

//add Cell
const createCell = async (req, res) => {
  try {
    const { name, address } = req.body;
    const { id } = req.params;

    const locations = await Location.find({ admin: id });
    const locationId = locations.map((loc) => loc._id);

    const newCell = new Cell({
      name,
      address,
      location: locationId,
    });

    await newCell.save();

    await Location.updateOne({ admin: id }, { $push: { cells: newCell._id } });

    res.status(201).json({
      success: true,
      data: newCell,
      message: "cell Created Successfully",
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

const fetchAllCell = async (req, res) => {
  try {
    const { id } = req.params;

    const locations = await Location.find({ admin: id });

    const locationIds = locations.map((loc) => loc._id);

    const cells = await Cell.find({
      location: { $in: locationIds },
    })
      .populate("location", "name")
      .populate("moderator", "name");

    res.status(200).json({
      success: true,
      message: "Cells retrieved successfully",
      data: cells,
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

const editCell = async (req, res) => {
  try {
    const { moderator, name, address } = req.body;
    const { id } = req.params;

    const cell = await Cell.findById(id);
    if (!cell) {
      return res.status(404).json({
        success: false,
        message: "Cell not found.",
      });
    }

    if (cell.moderator !== moderator) {
      await User.updateOne({ _id: cell.moderator }, { cell: null });
      await User.updateOne({ _id: cell.moderator }, { role: "user" });
    }

    cell.name = name || cell.name;
    cell.moderator = moderator || cell.moderator;
    cell.address = address || cell.address;

    await cell.save();

    await User.updateOne({ _id: moderator }, { cell: id });
    await User.updateOne({ _id: moderator }, { role: "moderator" });

    res.status(200).json({
      success: true,
      message: "Cell Edited successfully",
      data: cell,
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
//delete
//
const deleteCell = async (req, res) => {
  try {
    const { id } = req.params;

    const deleteCell = await Cell.findById(id);

    if (!deleteCell) {
      return res.status(404).json({ message: "Cell not found." });
    }

    await User.updateOne({ _id: deleteCell.moderator }, { cell: null });
    await User.updateOne({ _id: deleteCell.moderator }, { role: "user" });

    const location = await Location.findById(deleteCell.location);
    location.cells = location.cells.filter(
      (cell) => cell._id.toString() !== id
    );
    await location.save();

    await Cell.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Cells Deleted successfully",
    });
    //
    //
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      req,
      message: "An error Occurred",
    });
  }
};

module.exports = { createCell, fetchAllCell, editCell, deleteCell };
