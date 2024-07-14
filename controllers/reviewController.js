const Review = require('./../models/review');
const Campground = require('./../models/campGround');

module.exports.createReview = async (req, res) => {
    const campground = await Campground.findById(req.params.campgroundId);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'New Review Added');
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteReview = async (req, res) => {
    const { campgroundId, reviewId } = req.params;
    await Campground.findByIdAndUpdate(campgroundId, { $pull: {reviews: reviewId}});  // Pull functionality
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Deleted Review');
    res.redirect(`/campgrounds/${campgroundId}`);
};

