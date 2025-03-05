const User = require("../models/User");
const { getUserDetailsService } = require("../service/userService");

const userDetails = async (req, res) => {
  try {
    const userDetailsServiceResponse = await getUserDetailsService(req, res);
    if (!userDetailsServiceResponse.success)
      throw userDetailsServiceResponse.error;

    return res.status(200).json({
      message: "Details fetched successfully!",
      success: true,
      data: userDetailsServiceResponse.data
    });
  } catch (error) {
    return res.status(500).json({
      message: "Can't fetch user Details!",
      success: false,
      error: error.message
    });
  }
};

module.exports = userDetails;
