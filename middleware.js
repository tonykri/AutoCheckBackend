const ExpressError=require('./utils/ExpressError');

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated())
        throw new ExpressError("Unauthorized.", 403);
    next();
}

module.exports.userLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated() || req.user.role !== 'user')
        throw new ExpressError("Unauthorized.", 403); 
    next();
}

module.exports.professionalLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated() || req.user.role !== 'professional')
        throw new ExpressError("Unauthorized.", 403); 
    next();
}
