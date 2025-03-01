const Cell = require("../../model/cell");
const Location = require("../../model/location");
const Attendee = require("../../model/attendee");
const Attendance = require("../../model/attendance");

const AdminAttendanceStats = async (req, res) => {
  try {
    const { adminId } = req.params;

    const location = await Location.find({ admin: adminId });
    if (!location.length) {
      return res
        .status(404)
        .json({ message: "No location found for this location." });
    }
    const locationId = location[0]?._id;

    const cells = await Cell.find({ location: locationId });

    if (!cells.length) {
      return res
        .status(404)
        .json({ message: "No cells found for this location." });
    }

    const cellIds = cells.map((cell) => cell._id);

    // Fetch all attendance records for these cells
    const attendanceRecords = await Attendance.find({ cell: { $in: cellIds } });

    if (!attendanceRecords.length) {
      return res.json({
        locationId,
        presentPercentage: 0,
        absentPercentage: 0,
      });
    }

    // Calculate total attendees and present attendees
    let totalAttendees = 0;
    let totalPresent = 0;

    attendanceRecords.forEach((record) => {
      totalAttendees += record.attendees.length;
      totalPresent += record.attendees.filter(
        (a) => a.status === "present"
      ).length;
    });

    // Calculate percentages
    const presentPercentage = ((totalPresent / totalAttendees) * 100).toFixed(
      2
    );
    const absentPercentage = (100 - presentPercentage).toFixed(2);

    res.status(201).json({
      success: true,
      message: "Fetched Successfully",
      data: { locationId, presentPercentage, absentPercentage },
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

module.exports = { AdminAttendanceStats };
