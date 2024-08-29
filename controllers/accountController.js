const Account=require('../models/Account');
const ExpressError = require('../utils/ExpressError');
const {passwordValidator} = require('../validators/passwordValidator');
const {usernameValidator} = require('../validators/usernameValidator');

module.exports.register=async(req,res)=>{
    try{
    const {username, password, email, role, phoneNumber} = req.body;
    usernameValidator(username);
    passwordValidator(password);
    const account = new Account({username, password, email, role, phoneNumber});
    await Account.register(account,password);
    await account.save();
    res.status(200).json({
        message: 'Registered successfully!'
    });
    }catch(e){
        if (e.statusCode === 400) 
            throw new ExpressError(e.message, 400)

        if (e.code === 11000) 
            throw new ExpressError("Username or email already exists.", 409)

        throw new ExpressError(e.message, 500)
    }
}

module.exports.login=(req,res)=>{
    res.status(200).json({
        message: 'Logged in successfully!',
        user: req.user
    });
}

module.exports.logout=(req,res)=>{
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.status(200).json({
            message: 'Logged out successfully!'
        });
    });
}
