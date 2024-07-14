const express = require('express');
const router = express.Router();
const User = require('./../models/user');
const catchAsync = require('./../utils/catchAsync');
const passport = require('passport');
const authController = require('./../controllers/authController');

const { storeReturnTo } = require('./../middelware');

router.get(
    '/register', 
    authController.getRegister
);

router.post(
    '/register', 
    catchAsync(authController.registerUser)
);

router.get(
    '/login', 
    authController.getLogin
);

router.post(
    '/login', 
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

