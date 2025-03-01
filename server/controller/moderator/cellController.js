const Cell = require("../../model/cell");
const User = require("../../model/userModel");

const fetchCell = async (req, res) => {
  try {
    const { id } = req.params;

    const cell = await User.findById(id).populate(
      "cell",
      "name address location moderator"
    );

    if (!cell) {
      res.status(404).json({
        success: false,
        message: "Cell not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Cells retrieved successfully",
      data: cell,
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

module.exports = { fetchCell };
