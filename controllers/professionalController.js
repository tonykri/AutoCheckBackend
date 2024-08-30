const Professional = require('../models/Professional');
const ExpressError=require('../utils/ExpressError');

module.exports.registerProfessional = async (req, res) => {
    try{
        const {firstname, lastname, birthdate, workingPlaces, engineCategories} = req.body;
        const loggedInUser = req.user;
        const professionalExists = await Professional.exists({ account: loggedInUser.id });
        if (professionalExists) 
            throw new ExpressError(`Professional exists.`, 400)

        const professional = Professional({firstname, lastname, birthdate, account: loggedInUser, workingPlaces, engineCategories});
        await professional.save();

        res.status(200).json({
            message: 'Registered professional successfully!'
        });
    }catch(e){
        throw e;
    }
};

module.exports.getProfessional = async(req, res) => {
    try {
        const loggedInUser = req.user;
        const user = await Professional.findOne({account: loggedInUser.id});
        res.status(200).json(user);
    }catch(e){
        throw e;
    }
};

module.exports.updateProfessional = async(req, res) => {
    try {
        const {firstname, lastname, birthdate, workingPlaces, engineCategories} = req.body;
        const loggedInUser = req.user;
        const user = await Professional.findOne({account: loggedInUser.id});

        user.firstname = firstname;
        user.lastname = lastname;
        user.birthdate = birthdate;
        user.workingPlaces = workingPlaces;
        user.engineCategories = engineCategories;

        await user.save();

        res.status(200).json(user);
    }catch(e){
        throw e;
    }
};