const Joi = require("joi");

const validateData = (userData, signupData) => {
  try {
    let schema ;

    if(signupData) {
       schema = Joi.object({
        emailId: Joi.string().email().required(),
        password: Joi.string().min(8).required(),
        firstName : Joi.string().required(),
      lastName : Joi.string().required(),
      })
    }
    else{
      schema = Joi.object({
        emailId: Joi.string().email().required(),
        password: Joi.string().min(8).required(),
      })
    }

    const { error } = schema.validate(userData);
    if (error) throw error;
    return {
      success: true
    };
  } catch (error) {
    return {
      success: false,
      error: error
    };
  }
};

module.exports = validateData;
