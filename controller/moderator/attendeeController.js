const Attendee = require("../../model/attendee");
const Cell = require("../../model/cell");

//add Attendee
const addAttendee = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      sex,
      dateOfBirth,
      marriageAnniversary,
      address,
    } = req.body;

    const { id } = req.params;

    const cell = await Cell.find({ moderator: id });

    const newlyCreatedAttendee = new Attendee({
      name,
      email,
      phone,
      sex,
      dateOfBirth,
      marriageAnniversary,
      address,
      cell: cell[0]?._id,
    });

    await newlyCreatedAttendee.save();

    // const newAttendee = await Attendee.find({ email });

    await Cell.updateOne(
      { moderator: id },
      { $push: { attendees: newlyCreatedAttendee._id } }
    );

    res.status(201).json({
      success: true,
      data: newlyCreatedAttendee,
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
//fetch Attendee
//
const fetchAllAttendee = async (req, res) => {
  try {
    const { id } = req.params;
    const cell = await Cell.find({ moderator: id }).populate(
      "attendees",
      "name email phone address membership"
    );

    const cellAttendee = cell[0]?.attendees;

    res.status(201).json({
      success: true,
      message: "Member Registered Successfully ",
      data: cellAttendee,
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
//Edit
//
const editAttendee = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      phone,
      sex,
      dateOfBirth,
      marriageAnniversary,
      address,
    } = req.body;

    let findAttendee = await Attendee.findById(id);
    if (!findAttendee) {
      return res.status(404).json({
        success: false,
        message: "Attendee not found",
      });
    }

    (findAttendee.name = name || findAttendee.name),
      (findAttendee.email = email || findAttendee.email),
      (findAttendee.phone = phone || findAttendee.phone),
      (findAttendee.sex = sex || findAttendee.sex),
      (findAttendee.dateOfBirth = dateOfBirth || findAttendee.dateOfBirth),
      (findAttendee.marriageAnniversary =
        marriageAnniversary || findAttendee.marriageAnniversary),
      (findAttendee.address = address || findAttendee.address);

    await findAttendee.save();
    res.status(200).json({
      success: true,
      data: findAttendee,
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

const enrollMembership = async (req, res) => {
  try {
    const { id } = req.params;

    let findAttendee = await Attendee.findById(id);
    if (!findAttendee) {
      return res.status(404).json({
        success: false,
        message: "Attendee not found",
      });
    }

    findAttendee.membership = !findAttendee.membership;

    await findAttendee.save();
    res.status(200).json({
      success: true,
      data: findAttendee,
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
const deleteAttendee = async (req, res) => {
  try {
    const { id } = req.params;

    const attendee = await Attendee.findByIdAndDelete(id);
    if (!attendee)
      return res.status(404).json({
        success: false,
        message: "Attendee not Found",
      });

    const cell = await Cell.findById(attendee.cell);

    cell.attendees = cell.attendees.filter(
      (cell) => cell._id.toString() !== id
    );
    await cell.save();

    await Cell.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Attendee Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error Occurred",
    });
  }
};

module.exports = {
  addAttendee,
  editAttendee,
  fetchAllAttendee,
  deleteAttendee,
  enrollMembership,
};
