const Joi = require("joi");

const userDetailsSchema = Joi.object({
  emailId: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required()
});

const signInSchema = userDetailsSchema.fork(
  ["firstName", "lastName"],
  (schema) => schema.forbidden()
);

const validateData = (userData, signupData) => {
  try {
    let schema = signupData ? userDetailsSchema : signInSchema;

    const { error } = schema.validate(userData);
    if (error) throw error;

    return { success: true };
  } catch (error) {
    return { success: false, error: error };
  }
};

module.exports = validateData;
