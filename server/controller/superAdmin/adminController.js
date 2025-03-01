const User = require("../../model/userModel");

const fetchAdmin = async (req, res) => {
  try {
    const allAdmin = await User.find({
      $and: [{ cell: null }, { role: "user" }],
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
