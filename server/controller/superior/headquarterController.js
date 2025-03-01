const Headquarter = require("../../model/headquater");

const createHeadquarter = async (req, res) => {
  try {
    const { name, state } = req.body;
    const { superiorId } = req.params;

    // const headquarter = await Headquarter.find({ superior: superiorId });

    const newHeadquarter = new Headquarter({
      name,
      state,
      superior: superiorId,
    });

    await newHeadquarter.save();

    res.status(201).json({
      success: true,
      data: newHeadquarter,
      message: "Branch Created Successfully",
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

module.exports = { createHeadquarter };
