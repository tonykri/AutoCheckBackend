const express=require('express');
const router =express.Router();
const catchAsync=require('../utils/catchAsync');
const User=require('../models/User');
const users=require('../controllers/userController');
const {userLoggedIn}=require('../middleware');

router.route('/register')
    .post(userLoggedIn,catchAsync(users.registerUser));

router.route('/update')
    .post(userLoggedIn,catchAsync(users.updateUser));

router.route('/profile')
    .get(userLoggedIn,catchAsync(users.getUser));

module.exports=router;