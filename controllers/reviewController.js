const Application = require('../models/Application');
const Professional = require('../models/Professional');
const User = require('../models/User');
const Review = require('../models/Review');
const ExpressError=require('../utils/ExpressError');

module.exports.createReview = async (req, res) => {
    try {
        const {content, stars, professionalId} = req.body;
        const loggedInUser = req.user;
        const user = await User.findById(loggedInUser.id);
        const professional = await Professional.findById(professionalId);
        if (!professional) 
            throw new ExpressError('Professional not found.', 404);
        const application = await Application.findOne({user: user.id, professional: professional.id}).sort({ appliedAt: -1 });
        if (application) {
            const oneMonthAgo = new Date();
            oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
            if (application.appliedAt < oneMonthAgo) 
                throw new ExpressError('The application was made more than a month ago.', 400);
        } else 
            throw new ExpressError('No application found.', 404);
        
        const review = Review({content, stars, professional: professionalId, user: user.id});
        await review.save();
        res.status(201).json({
            message: 'Review created successfully.',
            review,
        });
    }catch(e) {
        throw e;
    }
}

module.exports.updateReview = async (req, res) => {
    try {
        const loggedInUser = req.user;
        const user = await User.findById(loggedInUser.id);
        const {content, stars, reviewId} = req.body;
        const review = await Review.findById(reviewId).populate('professional');
        if (!review) 
            throw new ExpressError('Review not found.', 404);
        const application = await Application.findOne({user: user.id, professional: review.professional.id}).sort({ appliedAt: -1 });
        if (application) {
            const oneMonthAgo = new Date();
            oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
            if (application.appliedAt < oneMonthAgo) {
                throw new ExpressError('The application was made more than a month ago.', 400);
            }
        }else
            throw new ExpressError('No application found.', 404);
        
        review.content = content;
        review.stars = stars;
        review.lastModifiedAt = new Date();
        await review.save();
        res.status(200).json({
            message: 'Review updated successfully.',
            review,
        });
    }catch(e) {
        throw e;
    }
}

module.exports.getProfessionalReviews = async (req, res) => {
    try {
        const {professionalId, page=1} = req.query;
        const professionalExists = await Professional.exists(professionalId);
        if (!professionalExists) 
            throw new ExpressError('Professional not found.', 404);
        const reviews = await Review.find({ professional: professionalId }).populate('user')
            .skip((page - 1) * 10) 
            .limit(10);
        res.status(200).json({
            No_of_reviews: reviews.length,
            reviews: reviews
        });
    }catch(e) {
        throw e;
    }
}

module.exports.getMyReviews = async (req, res) => {
    try {
        const {page=1} = req.query;
        const user = await User.findById(req.user.id);
        const reviews = await Review.find({ user: user.id }).populate('professional')
            .skip((page - 1) * 10) 
            .limit(10);
        res.status(200).json({
            No_of_reviews: reviews.length,
            reviews: reviews
        });
    }catch(e) {
        throw e;
    }
}

module.exports.getUserProfessionalReview = async (req, res) => {
    try {
        const {professionalId} = req.query;
        const professionalExists = await Professional.exists(professionalId);
        if (!professionalExists) 
            throw new ExpressError('Professional not found.', 404);
        const user = await User.findById(req.user.id);
        const review = await Review.find({ user: user.id, professional: professionalId });
        res.status(200).json(review);
    }catch(e) {
        throw e;
    }
}
