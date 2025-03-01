const Member = require("../../model/member");
const Cell = require("../../model/cell");
const Attendee = require("../../model/attendee");

// const addMember = async (req, res) => {
//   try {
//     const { email, name } = req.body;
//     const { moderatorId } = req.params;

//     const attendee = await Attendee.find({ email: email });
//     if (!attendee) {
//       return res.status(404).json({
//         success: false,
//         message: "Attendee not found",
//       });
//     }

//     const cell = await Cell.find({ moderator: moderatorId });
//     if (!cell) {
//       return res.status(404).json({
//         success: false,
//         message: "Cell not found",
//       });
//     }

//     console.log(email, attendee[0]?._id, cell[0]?._id);

//     const newlyCreatedMember = new Member({
//       attendee: attendee[0]?._id,
//       cell: cell[0]?._id,
//     });

//     await newlyCreatedMember.save();

//     res.status(201).json({
//       success: true,
//       data: newlyCreatedMember,
//     });
//     //
//     //
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       success: false,
//       message: "Error Occurred",
//     });
//   }
// };

//
//fetch
//

const fetchMember = async (req, res) => {
  try {
    const { moderatorId } = req.params;

    const cell = await Cell.find({ moderator: moderatorId });
    if (!cell) {
      return res.status(404).json({
        success: false,
        message: "Cell not found",
      });
    }

    const cellId = cell[0]?._id;
    const memberList = await Attendee.find({
      $and: [{ cell: cellId }, { membership: true }],
    });

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

module.exports = { fetchMember };
