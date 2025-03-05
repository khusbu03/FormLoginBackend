const User = require("../models/User");

async function getUserDetailsService(req,res){
    try {
        const { _id } = req.body.user;
        if (!_id)throw new Error("user Id is missing");

        const existingUser = await User.findOne({ _id });
        if (!existingUser)throw new Error("User does not exist!");
    
        existingUser.password = undefined;
    
        return { success: true, data: existingUser }
      } catch (error) {
        return {
          message: "Error occurred while fetching user Details!",
          success:false,
          error:error,
        }
      }

}
module.exports={
    getUserDetailsService
}