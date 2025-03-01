const Cell = require("../../model/cell");
const Location = require("../../model/location");
const Branch = require("../../model/branch");
const Attendance = require("../../model/attendance");
const Attendee = require("../../model/attendee");
const Headquarter = require("../../model/headquater");

const SuperiorAttendanceStats = async (req, res) => {
  try {
    const { superiorId } = req.params;
    const headquarter = await Headquarter.find({ superior: superiorId });
    const headquarterId = headquarter[0]?._id;

    const branches = await Branch.find({ headquarter: headquarterId });

    if (!branches.length) {
      return res
        .status(404)
        .json({ message: "No branches found under this headquarters." });
    }

    let branchAttendanceStats = [];
    let totalPresents = 0;

    for (const branch of branches) {
      const locations = await Location.find({ branch: branch._id });
      const cellIds = (
        await Cell.find({
          location: { $in: locations.map((loc) => loc._id) },
        })
      ).map((cell) => cell._id);
      const attendanceRecords = await Attendance.find({
        cell: { $in: cellIds },
      });

      let branchPresent = 0;
      attendanceRecords.forEach((record) => {
        branchPresent += record.attendees.filter(
          (a) => a.status === "present"
        ).length;
      });

      totalPresents += branchPresent;

      branchAttendanceStats.push({
        branch: branch.name,
        present: branchPresent, // Store raw present count for normalization
      });
    }

    //
    //2
    //    // Step 2: Normalize attendance percentages so they sum up to 100%
    branchAttendanceStats = branchAttendanceStats.map((b) => ({
      branch: b.branch,
      presentPercentage:
        totalPresents > 0 ? ((b.present / totalPresents) * 100).toFixed(2) : 0,
    }));

    const branchIds = branches.map((branch) => branch._id);

    // Find all locations under these branches
    const locations = await Location.find({ branch: { $in: branchIds } });

    if (!locations.length) {
      return res
        .status(404)
        .json({ message: "No locations found in these branches." });
    }

    // Extract location IDs
    const locationIds = locations.map((location) => location._id);

    // Find all cells under these locations
    const cells = await Cell.find({ location: { $in: locationIds } });

    if (!cells.length) {
      return res.json({
        headquarterId,
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
        headquarterId,
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
        headquarterId,
        presentPercentage,
        absentPercentage,
        totalAttendees,
        branchAttendanceStats,
        branch: branches.length,
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

module.exports = { SuperiorAttendanceStats };
