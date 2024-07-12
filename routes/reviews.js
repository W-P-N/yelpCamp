const express = require('express');
const catchAsync = require('./../utils/catchAsync');
const ExpressError = require('./../utils/ExpressError');
const { reviewSchema } = require('./../schemas');

const router = express.Router({mergeParams: true});

// Models
const Review = require('./../models/review');
const Campground = require('./../models/campGround');

// Validates review.
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

router.post('/', validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.campgroundId);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.delete('/:reviewId', catchAsync(async (req, res) => {
    const { campgroundId, reviewId } = req.params;
    await Campground.findByIdAndUpdate(campgroundId, { $pull: {reviews: reviewId}});  // Pull functionality
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${campgroundId}`);
}));


module.exports = router;
