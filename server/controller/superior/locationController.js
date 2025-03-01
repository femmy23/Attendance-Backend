const Location = require("../../model/location");

const fetchLocationById = async (req, res) => {
  try {
    const { branchId } = req.params;

    const location = await Location.find({
      branch: branchId,
    })
      .populate("branch", "name")
      .populate("admin", "name email");

    res.status(200).json({
      success: true,
      message: "Cells retrieved successfully",
      data: location,
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

module.exports = { fetchLocationById };
