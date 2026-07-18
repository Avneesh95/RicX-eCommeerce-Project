const User = require("../model/UserModel");

const profile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password");

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = profile;