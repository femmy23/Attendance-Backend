const Location = require("../../model/location");
const Attendee = require("../../model/attendee");
const Cell = require("../../model/cell");

const fetchAttendeeByCellId = async (req, res) => {
  try {
    const { cellId } = req.params;

    const attendee = await Attendee.find({ cell: cellId });

    res.status(200).json({
      success: true,
      message: "Cells retrieved successfully",
      data: attendee,
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

module.exports = { fetchAttendeeByCellId };
