const Cell = require("../../model/cell");
const Location = require("../../model/location");
const Branch = require("../../model/branch");
const Attendance = require("../../model/attendance");
const Attendee = require("../../model/attendee");

const SuperAdminAttendanceStats = async (req, res) => {
  try {
    const { superAdminId } = req.params;

    const branch = await Branch.find({ superAdmin: superAdminId });
    const branchId = branch[0]?._id;

    // Find all locations under this branch
    const locations = await Location.find({ branch: branchId });

    if (!locations.length) {
      return res
        .status(404)
        .json({ message: "No locations found in this branch." });
    }

    let locationAttendanceStats = [];
    let totalPresents = 0;

    for (const location of locations) {
      // Get all cell IDs under this location
      const cellIds = (await Cell.find({ location: location._id })).map(
        (cell) => cell._id
      );

      // Get all attendance records for these cells
      const attendanceRecords = await Attendance.find({
        cell: { $in: cellIds },
      });

      let locationPresent = 0;
      attendanceRecords.forEach((record) => {
        locationPresent += record.attendees.filter(
          (a) => a.status === "present"
        ).length;
      });

      totalPresents += locationPresent;

      locationAttendanceStats.push({
        location: location.name,
        present: locationPresent, // Store raw present count for normalization
      });
    }

    //
    // Step 2: Normalize attendance percentages so they sum up to 100%
    locationAttendanceStats = locationAttendanceStats.map((l) => ({
      location: l.location,
      presentPercentage:
        totalPresents > 0 ? ((l.present / totalPresents) * 100).toFixed(2) : 0,
    }));

    // Extract location IDs
    const locationIds = locations.map((location) => location._id);

    // Find all cells under these locations
    const cells = await Cell.find({ location: { $in: locationIds } });

    if (!cells.length) {
      return res.json({
        branchId,
        presentPercentage: 0,
        absentPercentage: 0,
        totalAttendees: 0,
      });
    }

    // Extract cell IDs
    const cellIds = cells.map((cell) => cell._id);

    // Find all attendance records for these cells
    const attendanceRecords = await Attendance.find({ cell: { $in: cellIds } });

    if (!attendanceRecords.length) {
      return res.json({
        branchId,
        presentPercentage: 0,
        absentPercentage: 0,
        totalAttendees: 0,
      });
    }

    // Calculate total attendees and total present
    let totalAttendees = await Attendee.countDocuments({
      cell: { $in: cellIds },
    });
    let totalPresent = 0;

    attendanceRecords.forEach((record) => {
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
      data: {
        branchId,
        presentPercentage,
        absentPercentage,
        totalAttendees,
        locationAttendanceStats,
        cell: cells.length,
        location: locations.length,
      },
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

module.exports = { SuperAdminAttendanceStats };
