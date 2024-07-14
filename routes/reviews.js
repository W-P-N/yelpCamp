const express = require('express');
const catchAsync = require('./../utils/catchAsync');
const { validateReview, isLoggedIn, isReviewAuthor } = require('./../middelware');

const router = express.Router({mergeParams: true});

// Models
const Review = require('./../models/review');
const Campground = require('./../models/campGround');

router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.campgroundId);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'New Review Added');
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
    const { campgroundId, reviewId } = req.params;
    await Campground.findByIdAndUpdate(campgroundId, { $pull: {reviews: reviewId}});  // Pull functionality
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Deleted Review');
    res.redirect(`/campgrounds/${campgroundId}`);
}));


module.exports = router;
