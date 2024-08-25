const User=require('../models/User');
const ExpressError=require('../utils/ExpressError');

module.exports.registerUser=async(req,res)=>{
    try{
        const {firstname, lastname, birthdate} = req.body;
        const loggedInUser = req.user;
        const userExists = await User.exists({ account: loggedInUser.id });
        if (userExists) 
            throw new ExpressError(`User exists.`, 400)

        const user = User({firstname, lastname, birthdate, account: loggedInUser})
        await user.save();

        res.status(200).json({
            message: 'Registered user successfully!'
        });
    }catch(e){
        throw e;
    }
}

module.exports.getUser = async(req, res) => {
    try {
        const loggedInUser = req.user;
        const user = await User.findOne({account: loggedInUser.id});
        res.status(200).json(user);
    }catch(e){
        throw e;
    }
}

module.exports.updateUser = async(req, res) => {
    try {
        const {firstname, lastname, birthdate} = req.body;
        const loggedInUser = req.user;
        const user = await User.findOne({account: loggedInUser.id});

        user.firstname = firstname;
        user.lastname = lastname;
        user.birthdate = birthdate;

        await user.save();

        res.status(200).json(user);
    }catch(e){
        throw e;
    }
}