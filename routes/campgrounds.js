const express = require('express');
const catchAsync = require('./../utils/catchAsync');
const ExpressError = require('./../utils/ExpressError');
const { campgroundSchema } = require('./../schemas');
const { isLoggedIn } = require('./../middelware');

// Models
const Campground = require('./../models/campGround');

// Middleware
const validateCampground = (req, res, next) => {
    const { error }= campgroundSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

const router = express.Router();

router.get('/', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds})
});

router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res) => {
    req.flash('success', 'Successfully made new campground');
    const campground = new Campground(req.body.campground);
    if(!campground) throw new ExpressError("Invalid Campground data", 400);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}))

router.get('/new', isLoggedIn, (req, res) => { 
    res.render('campgrounds/new');
})

router.get('/:id', isLoggedIn, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');
    if(!campground) {
        req.flash('error', 'Cannot Find that campground.');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground:campground });
}))

router.put('/:id', isLoggedIn, validateCampground, catchAsync(async(req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
        ...req.body.campground
    }, {new: true});
    req.flash('success', 'Successfully updated campground');
    res.redirect(`/campgrounds/${campground._id}`);
}))

router.delete('/:id', isLoggedIn, catchAsync(async(req,res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    if(!campground) {
        req.flash('error', 'Cannot Find that campground.');
        return res.redirect(`/campgrounds`);
    }
    req.flash('success', 'Deleted Campground');
    res.redirect('/campgrounds');
}));

router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground });
}))



module.exports = router;
