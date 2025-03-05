const validateData = require("../utils/Validation/dataValidation");

const validation = async (req, res, next) => {
  try {
    let isSignUpData = true;
    if (req.url === "/login") isSignUpData = false;

    const validation = validateData(req.body, isSignUpData);
    if (!validation.success) throw validation.error;
    console.log("Data validated!");
    next();
  } catch (error) {
    console.log(
      "Error occurred while validating the data ",
      error.details?.[0]?.message
    );
    res.status(401).json({
      error: error.details?.[0]?.message,
      success: false
    });
  }
};

module.exports = validation;
