const Location = require("../../model/location");
const Cell = require("../../model/cell");

const fetchCellById = async (req, res) => {
  try {
    const { locationId } = req.params;

    const cell = await Cell.find({
      location: locationId,
    })
      .populate("location", "name")
      .populate("moderator", "name");

    res.status(200).json({
      success: true,
      message: "Cells retrieved successfully",
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

module.exports = { fetchCellById };
