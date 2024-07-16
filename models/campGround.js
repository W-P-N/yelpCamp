const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');

const opts = { toJSON: {virtuals: true} };

const imageSchema = new Schema ({
    url: String,
    filename: String
});

imageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/w_200');
});

const campgroundSchema = new Schema({
    title: String,
    images: [
        imageSchema
    ],
    geometry: {
        type: {
            type: String,
            enume: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, opts);

campgroundSchema.virtual('properties.popUpMarkup').get(function() {
    return `<a href="/campgrounds/${this._id}">${this.title}</a><p>Rs.${this.price}</p>`
});


campgroundSchema.post('findOneAndDelete', async function(campground) {
    if(campground) {
        await Review.deleteMany({
            _id: {
                $in: campground.reviews
            }
        })
    }
});

module.exports = mongoose.model('Campground', campgroundSchema);
