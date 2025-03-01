const Cell = require("../../model/cell");
const Location = require("../../model/location");
const Attendee = require("../../model/attendee");

const fetchMemberByAdmin = async (req, res) => {
  try {
    const { adminId } = req.params;

    const location = await Location.find({ admin: adminId });
    if (!location) {
      return res.status(404).json({
        success: false,
        message: "Location not found",
      });
    }
    const locationId = location[0]?._id;

    const cells = await Cell.find({ location: locationId });

    if (!cells.length > 0) {
      return res
        .status(404)
        .json({ message: "No cells found for this location" });
    }

    const cellIds = cells.map((cell) => cell._id);

    const memberList = await Attendee.find({
      cell: { $in: cellIds },
      membership: true,
    })
      .select("name email phone cell ")
      .populate("cell", "name");

    if (!memberList || !memberList > 0) {
      return;
    }

    res.status(201).json({
      success: true,
      message: "Fetched Successfully",
      data: memberList,
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

module.exports = { fetchMemberByAdmin };
