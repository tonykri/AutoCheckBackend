const express=require('express');
const router =express.Router();
const catchAsync=require('../utils/catchAsync');
const professionals=require('../controllers/professionalController');
const {professionalLoggedIn}=require('../middleware');

router.route('/register')
    .post(professionalLoggedIn,catchAsync(professionals.registerProgetProfessional));

router.route('/update')
    .put(professionalLoggedIn,catchAsync(professionals.updateProgetProfessional));

router.route('/profile')
    .get(professionalLoggedIn,catchAsync(professionals.getProfessional));

module.exports=router;