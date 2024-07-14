const express = require('express');
const router = express.Router();
const catchAsync = require('./../utils/catchAsync');
const passport = require('passport');
const authController = require('./../controllers/authController');

const { storeReturnTo } = require('./../middelware');

router.route('/register')
    .get(
        authController.getRegister
    )
    .post(
        catchAsync(authController.registerUser)
    );

router.route('/login')
    .get(
        authController.getLogin
    )
    .post(
        storeReturnTo, 
        passport.authenticate(
            'local', {
                failureFlash: true, 
                failureRedirect: '/login'
            }
        ), 
        catchAsync(authController.loginUser)
    );

router.get(
    '/logout', 
    authController.logout
);

module.exports = router;

