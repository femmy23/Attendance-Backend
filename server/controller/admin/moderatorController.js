const User = require("../../model/userModel");

const fetchModerators = async (req, res) => {
  try {
    const allModerator = await User.find({
      $and: [
        { cell: null },
        { location: null },
        { branch: null },
        { role: "user" },
      ],
    });

    res.status(201).json({
      success: true,
      data: allModerator,
      message: "cell Created Successfully",
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

module.exports = { fetchModerators };
