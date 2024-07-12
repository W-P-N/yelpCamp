const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const ExpressError = require('./utils/ExpressError');

// Routes
const campgroundsRoute = require('./routes/campgrounds');
const reviewsRoute = require('./routes/reviews');


// Connect Local Database
connectDb().catch(err => console.log(err));

// Function to connect Local db
async function connectDb() {
  await mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp', {}).then(() => {
    console.log("Database Connected");
  })
}

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

const sessionConfig = {
    secret: 'thisissecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));

app.use('/campgrounds', campgroundsRoute);
app.use('/campgrounds/:campgroundId/reviews', reviewsRoute);

app.get('/', (req, res) => {
    res.render('home');
})

app.all('*', (req, res, next) => {
    next(new ExpressError("Page not found", 404));
})

app.use((err, req, res, next) => {
    const { status = 500, message } = err;
    if(!err.message) err.message = 'Something went wrong';
    res.status(status).render('error', {err: err});
})

app.listen(3000, () => {
    console.log("Server running on port 3000.");
})
