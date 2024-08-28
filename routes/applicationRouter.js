const express=require('express');
const router =express.Router();
const catchAsync=require('../utils/catchAsync');
const applications=require('../controllers/applicationController');
const {isLoggedIn, userLoggedIn, professionalLoggedIn}=require('../middleware');

router.route('/')
    .get(isLoggedIn, catchAsync(applications.getApplication))
    .post(isLoggedIn, catchAsync(applications.createApplication))
    .delete(isLoggedIn, catchAsync(applications.deleteApplication));

router.get('/all', professionalLoggedIn, catchAsync(applications.getApplications));
router.get('/me', userLoggedIn, catchAsync(applications.getMyApplications));