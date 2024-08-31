const Application = require('../models/Application');
const ApplicationInterest = require('../models/ApplicationInterest');
const Professional = require('../models/Professional');
const ExpressError=require('../utils/ExpressError');

module.exports.showInterest = async (req, res) => {
    try {
        const { applicationId } = req.query;
        if(!applicationId)
            throw new ExpressError('ApplicationId is required.', 404);
        const application = await Application.findById(applicationId);
        if (!application) 
            throw new ExpressError('Application not found.', 404);
        
        const loggedInUser = req.user;
        const professional = await Professional.findOne({user: loggedInUser.id});

        const interest = ApplicationInterest({professional, application});
        await interest.save();

        if (application.status === 'pending') {
            application.status = 'applied';
            await application.save();
        }
        res.status(200).json({
            message: 'Application interest created successfully!',
            application: interest
        });
    }catch (e) {
        throw e;
    }
}

module.exports.getMyApplicationInterests = async (req, res) => {
    try {
        const {page =1} = req.query;
        const loggedInUser = req.user;
        const professional = await Professional.findOne({user: loggedInUser.id});

        const applications = await ApplicationInterest.find({ professional: professional.id }).populate('application')
            .skip((page - 1) * 10) 
            .limit(10);
        res.status(200).json(applications);
    }catch (e) {
        throw e;
    }
}

module.exports.getApplicants = async (req, res) => {
    try {
        const {page =1, applicationId} = req.query;
        const applicationExists = await Application.exists({ id: applicationId });
        if(!applicationExists)
            throw new ExpressError('Application with id ' + applicationId + ' does not exist.', 404);
        const professionals = await ApplicationInterest.find({ application: applicationId }).populate('professional')
            .skip((page - 1) * 10) 
            .limit(10);
        res.status(200).json(professionals);
    }catch (e) {
        throw e;
    }
}

module.exports.acceptApplicant = async (req, res) => {
    try {
        const {applicationInterestId} = req.query;
        const applicationInterest = await ApplicationInterest.findById(applicationInterestId);
        if(!applicationInterest)
            throw new ExpressError('Application interest with id ' + applicationInterestId + ' does not exist.', 404);
        const application = await Application.findById(applicationInterest.application);
        const professional = await Professional.findById(applicationInterest.professional);
        if(application.user.id !== req.user.id)
            throw new ExpressError('Application does not belong to current user.', 403);
        application.professional = professional;
        application.status = 'accepted';
        await application.save();
        res.status(200).json({
            message: 'Professional commited successfully!'
        });
    }catch (e) {
        throw e;
    }
}

module.exports.closeApplication = async (req, res) => {
    try {
        const {applicationId} = req.query;
        const application = await Application.findById(applicationId);
        if (!application)
            throw new ExpressError(`Application with id: ${applicationId} not found.`, 404);
        const professional = await Professional.findOne({account: req.user.id});
        if (professional.id !== application.professional.id)
            throw new ExpressError('Unauthorized.', 403);
        application.status = 'done';
        await application.save();
        res.status(200).json({
            message: 'Task completed successfully!'
        });
    } catch (e) {
        throw e;
    }
}