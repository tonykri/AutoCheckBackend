const express=require('express');
const router =express.Router();
const catchAsync=require('../utils/catchAsync');
const accounts=require('../controllers/accountController');
const passport = require('passport');
const {isLoggedIn}=require('../middleware');

router.route('/register')
    .post(catchAsync(accounts.register));

router.route('/login')
    .post(passport.authenticate('local') ,accounts.login);

router.get('/logout',isLoggedIn,accounts.logout);

module.exports=router;