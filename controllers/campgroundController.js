const ExpressError = require('./../utils/ExpressError');
const { cloudinary } = require('./../cloudinary');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding-v6');
const mapboxtoken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapboxtoken});

// Models
const Campground = require('./../models/campGround');

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds})
};

module.exports.makeCampground = async (req, res) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
      }).send()
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;
    campground.images = req.files.map(f => ({url: f.path, filename: f.filename}));
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully made new campground');
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.newCampground = (req, res) => { 
    res.render('campgrounds/new');
};

module.exports.viewCampground = async (req, res) => {
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
};

module.exports.updateCampground = async(req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}));
    campground.images.push(...imgs);
    await campground.save();
    if (req.body.deleteImages) {
        for(let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}});
    }
    req.flash('success', 'Successfully updated campground');
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async(req,res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    if(!campground) {
        req.flash('error', 'Cannot Find that campground.');
        return res.redirect(`/campgrounds`);
    }
    req.flash('success', 'Deleted Campground');
    res.redirect('/campgrounds');
};

module.exports.editCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if(!campground) {
        req.flash('error', 'Cannot Find that campground.');
        return res.redirect(`/campgrounds`);
    }
    res.render('campgrounds/edit', { campground });
}

