const express=require('express');
const router =express.Router();
const catchAsync=require('../utils/catchAsync');
const reviews=require('../controllers/reviewController');
const {userLoggedIn, isLoggedIn}=require('../middleware');

router.route('/')
    .get(isLoggedIn, catchAsync(reviews.getProfessionalReviews))
    .post(userLoggedIn, catchAsync(reviews.createReview))
    .put(userLoggedIn, catchAsync(reviews.updateReview));

router.get('/myreviews', userLoggedIn, catchAsync(reviews.getMyReviews));
router.get('/myreview', userLoggedIn, catchAsync(reviews.getUserProfessionalReview));