const Location = require("../../model/location");
const User = require("../../model/userModel");
const Branch = require("../../model/branch");
const Headquarter = require("../../model/headquater");

const createBranch = async (req, res) => {
  try {
    const { name, state } = req.body;
    const { superiorId } = req.params;

    const headquarter = await Headquarter.find({ superior: superiorId });

    const newBranch = new Branch({
      name,
      state,
      headquarter: headquarter[0]?._id,
    });

    await newBranch.save();

    await Headquarter.updateOne(
      { superior: superiorId },
      { $push: { branch: newBranch._id } }
    );

    res.status(201).json({
      success: true,
      data: newBranch,
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

//
//fetch
//
const fetchAllBranch = async (req, res) => {
  try {
    const { superiorId } = req.params;

    const headquarter = await Headquarter.find({
      superior: superiorId,
    }).populate({
      path: "branch",
      populate: { path: "superAdmin" },
    });

    if (!headquarter) {
      return res.status(404).json({
        success: false,
        message: "Branch not found",
      });
    }

    const headquarterBranch = headquarter[0]?.branch;

    res.status(201).json({
      success: true,
      message: "Member Registered Successfully ",
      data: headquarterBranch,
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
//edit
//
const editBranch = async (req, res) => {
  try {
    const { superAdmin, name, region } = req.body;
    const { branchId } = req.params;

    const branch = await Branch.findById(branchId);
    if (!branch) {
      return res.status(404).json({
        success: false,
        message: "Branch not found",
      });
    }

    if (branch.admin !== superAdmin) {
      await User.updateOne({ _id: branch.superAdmin }, { branch: null });
      await User.updateOne({ _id: branch.superAdmin }, { role: "user" });
    }

    branch.name = name || branch.name;
    branch.region = region || branch.region;
    branch.superAdmin = superAdmin || branch.superAdmin;

    await branch.save();

    await User.updateOne({ _id: branch.superAdmin }, { branch: branchId });

    await User.updateOne({ _id: branch.superAdmin }, { role: "superAdmin" });

    res.status(201).json({
      success: true,
      message: "Branch Edited Successfully ",
      data: branch,
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
const deleteBranch = async (req, res) => {
  try {
    const { id } = req.params;

    const branch = await Branch.findById(id);

    if (!branch) {
      return res.status(404).json({
        success: false,
        message: "Branch not found",
      });
    }

    await User.updateOne({ _id: branch.superAdmin }, { branch: null });
    await User.updateOne({ _id: branch.superAdmin }, { role: "user" });

    console.log(branch.headquarter);

    const headquarter = await Headquarter.findById(branch.headquarter);

    if (!headquarter) {
      return res.status(404).json({
        success: false,
        message: "headquarter not found",
      });
    }

    headquarter.branch = headquarter.branch.filter(
      (branch) => branch._id.toString() !== id
    );
    await headquarter.save();

    await Branch.findByIdAndDelete(id);

    res.status(201).json({
      success: true,
      message: "Deleted Successfully ",
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

module.exports = {
  createBranch,
  editBranch,
  deleteBranch,
  fetchAllBranch,
};
