const express=require('express');
const router =express.Router();
const catchAsync=require('../utils/catchAsync');
const applicationInterests=require('../controllers/applicationInterestController');
const {userLoggedIn, professionalLoggedIn}=require('../middleware');

router.route('/professional')
    .get(professionalLoggedIn, catchAsync(applicationInterests.getMyApplicationInterests));
router.route('/professional/show')
    .get(professionalLoggedIn, catchAsync(applicationInterests.showInterest));
router.route('/professional/close')
    .get(professionalLoggedIn, catchAsync(applicationInterests.closeApplication));

router.route('/user')
    .get(userLoggedIn, catchAsync(applicationInterests.acceptApplicant));
router.route('/user/applicants')
    .get(userLoggedIn, catchAsync(applicationInterests.getApplicants));

module.exports=router;