const express = require('express');
const catchAsync = require('./../utils/catchAsync');
const { isLoggedIn, validateCampground, isAuthor } = require('./../middelware');
const campgroundsController = require('./../controllers/campgroundController');

const router = express.Router();

router.route('/')
    .get(catchAsync(campgroundsController.index))
    .post(isLoggedIn, validateCampground, catchAsync(campgroundsController.makeCampground));

router.get('/new', isLoggedIn, campgroundsController.newCampground);

router.route('/:id')
    .get(catchAsync(campgroundsController.viewCampground))
    .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgroundsController.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgroundsController.deleteCampground));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgroundsController.editCampground));




module.exports = router;
