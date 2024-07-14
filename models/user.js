const mongoose = require('mongoose');

const passportLocalMongoose = require('passport-local-mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true
    }
});

userSchema.plugin(passportLocalMongoose);  // Adding passport and username field

module.exports = mongoose.model('User', userSchema);


