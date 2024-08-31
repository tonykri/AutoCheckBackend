const Application = require('../models/Application');
const ExpressError=require('../utils/ExpressError');

module.exports.createApplication = async (req, res) => {
    try {
        const { comment, postalCode, engineCategory } = req.body;
        const loggedInUser = req.user;
        const application = Application({comment, postalCode, engineCategory, user: loggedInUser});
        await application.save();

        res.status(200).json({
            message: 'Application created!'
        });
    } catch (e) {
        throw e;
    }
}

module.exports.deleteApplication = async (req, res) => {
    try {
        const { applicationId } = req.query;
        if(!applicationId)
            throw new ExpressError('ApplicationId is required.', 404);
        const application = await Application.findById(applicationId);
        if (!application) 
            throw new ExpressError('Application not found.', 404);
        if (application.user.toString() !== req.user._id.toString()) 
            throw new ExpressError('You do not have permission to delete this application.', 403);
        if (application.status === 'done' || application.status === 'accepted')
            throw new ExpressError('Application has been accepted by user and cannot be deleted.', 403);
    
        await Application.findByIdAndDelete(applicationId);
        res.status(200).json({
            message: 'Application deleted!'
        });
    }catch (e) {
        throw e;
    }
}

module.exports.getApplication = async (req, res) => {
    try {
        const { applicationId } = req.query;
        if(!applicationId)
            throw new ExpressError('ApplicationId is required.', 404);
        const application = await Application.findById(applicationId);
        if (!application) 
            throw new ExpressError('Application not found.', 404);
        res.status(200).json(application);
    }catch (e) {
        throw e;
    }
}

module.exports.getApplications = async (req, res) => {
    try {
        const { page=1, postalCodes, engineCategories } = req.query;
        const postalCodeArray = postalCodes ? postalCodes.split(',') : [];
        const engineCategoryArray = engineCategories ? engineCategories.split(',') : [];

        const query = {};
        if (postalCodeArray.length > 0) {
            query.postalCode = { $in: postalCodeArray };
        }
        if (engineCategoryArray.length > 0) {
            query.engineCategory = { $in: engineCategoryArray };
        }

        const applications = await Application.find(query)
            .skip((page - 1) * 10) 
            .limit(10);

        res.status(200).json(applications);
        
    }catch (e) {
        throw e;
    }
}

module.exports.getMyApplications = async (req, res) => {
    try {
        const { page=1, status } = req.query;
        let applications = [];
        if (status)
            applications = await Application.find({status: status, user: req.user.id})
                .skip((page - 1) * 10) 
                .limit(10);
        else
            applications = await Application.find({user: req.user.id})
                .skip((page - 1) * 10) 
                .limit(10);

                res.status(200).json(applications);
    }catch (e) {
        throw e;
    }
}
