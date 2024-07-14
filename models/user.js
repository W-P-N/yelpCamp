const mongoose = require('mogoose');

const passportLocalMongoose = require('passport-local-mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true
    }
});

UserSchema.plugin(passportLocalMongoose);  // Adding passport and username field

module.exports = mongoose.model('User', UserSchema);


