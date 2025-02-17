const User = require("../models/users")


const validEmail = async (email) =>{
    const valid = await User.findOne({email: email});
    return !valid;
}

module.exports = {validEmail};