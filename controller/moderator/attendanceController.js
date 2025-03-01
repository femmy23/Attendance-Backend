const Attendance = require("../../model/attendance");
const Cell = require("../../model/cell");
const User = require("../../model/userModel");

const addAttendance = async (req, res) => {
  try {
    const { adminId, attendees } = req.body;

    const cell = await Cell.find({ moderator: adminId });
    // if (!attendees.length > 0) {
    //   return res.status(500).json({
    //     success: false,
    //     message: "Attendance has not been marked",
    //   });
    // }

    const attendance = new Attendance({
      cell: cell[0]?._id,
      attendees,
    });

    await attendance.save();

    return res.status(201).json({
      success: true,
      data: attendance,
      message: "Attendance marked successfully",
    });
    //
    //
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error Occurred",
    });
  }
};

const fetchAttendance = async (req, res) => {
  try {
    const { modId } = req.params;

    const cell = await Cell.find({ moderator: modId });

    const attendanceList = await Attendance.find({ cell: cell[0]?._id })

      .populate("cell", "name")
      .populate("attendees.attendee", "name email");

    if (!attendanceList) {
      return res.status(404).json({
        success: false,
        message: "Attendance List Not Found Occurred",
      });
    }
    res.status(201).json({
      success: true,
      data: attendanceList,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error Occurred",
    });
  }
};

module.exports = { addAttendance, fetchAttendance };
