const express = require('express');
const catchAsync = require('./../utils/catchAsync');
const ExpressError = require('./../utils/ExpressError');
const { isLoggedIn, validateCampground, isAuthor } = require('./../middelware');

// Models
const Campground = require('./../models/campGround');

const router = express.Router();

router.get('/', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds})
});

router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    if(!campground) throw new ExpressError("Invalid Campground data", 400);
    await campground.save();
    req.flash('success', 'Successfully made new campground');
    res.redirect(`/campgrounds/${campground._id}`);
}))

router.get('/new', isLoggedIn, (req, res) => { 
    res.render('campgrounds/new');
})

router.get('/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if(!campground) {
        req.flash('error', 'Cannot Find that campground.');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground:campground });
}))

router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(async(req, res) => {
    const { id } = req.params;
    
    const camp = await Campground.findByIdAndUpdate(id, {...req.body});
    req.flash('success', 'Successfully updated campground');
    res.redirect(`/campgrounds/${campground._id}`);
}))

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async(req,res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    if(!campground) {
        req.flash('error', 'Cannot Find that campground.');
        return res.redirect(`/campgrounds`);
    }
    req.flash('success', 'Deleted Campground');
    res.redirect('/campgrounds');
}));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if(!campground) {
        req.flash('error', 'Cannot Find that campground.');
        return res.redirect(`/campgrounds`);
    }
    res.render('campgrounds/edit', { campground });
}))



module.exports = router;
