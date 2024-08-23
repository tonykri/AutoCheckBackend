const express=require('express');
const router =express.Router();
const catchAsync=require('../utils/catchAsync');
const Account=require('../models/Account');
const accounts=require('../controllers/accountController');
const passport = require('passport');

router.route('/register')
    .post(catchAsync(accounts.register));

router.route('/login')
    .post(passport.authenticate('local') ,accounts.login);

router.get('/logout',accounts.logout);

module.exports=router;