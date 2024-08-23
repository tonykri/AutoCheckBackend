const Account=require('../models/Account');
const passport = require('passport');

module.exports.register=async(req,res)=>{
    try{
    const {username, password, email, role} = req.body;
    const account = new Account({username, password, email, role});
    const registeredUser=await Account.register(account,password);
    req.login(registeredUser,err=>{   
        if(err) return next(err);
        res.status(200).json({
            message: 'Logged in successfully!'
        });
    })
    }catch(e){
        res.status(500).json(e);
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
