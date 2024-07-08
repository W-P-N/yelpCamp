const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

// Models
const Campground = require('./models/campGround');

// Connect Local Database
connectDb().catch(err => console.log(err));

// Function to connect Local db
async function connectDb() {
  await mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp', {}).then(() => {
    console.log("Database Connected");
  })
}

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.render('home');
})

app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds})
})

app.get('/campgrounds/:id', async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show', { campground });
})

app.listen(3000, () => {
    console.log("Server running on port 3000.");
})
