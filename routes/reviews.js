const express = require('express');
const catchAsync = require('./../utils/catchAsync');
const { validateReview, isLoggedIn, isReviewAuthor } = require('./../middelware');
const reviewController = require('./../controllers/reviewController');

const router = express.Router({mergeParams: true});

router.post('/', isLoggedIn, validateReview, catchAsync(reviewController.createReview));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviewController.deleteReview));

module.exports = router;
