const express = require('express');
const catchAsync = require('./../utils/catchAsync');
const { isLoggedIn, validateCampground, isAuthor } = require('./../middelware');
const campgroundsController = require('./../controllers/campgroundController');

const router = express.Router();

router.get('/', catchAsync(campgroundsController.index));

router.post('/', isLoggedIn, validateCampground, catchAsync(campgroundsController.makeCampground))

router.get('/new', isLoggedIn, campgroundsController.newCampground);

router.get('/:id', catchAsync(campgroundsController.viewCampground))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgroundsController.editCampground));

router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(campgroundsController.updateCampground))

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgroundsController.deleteCampground));


module.exports = router;
