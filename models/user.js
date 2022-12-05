const mongoose = require('mongoose');
// var passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
    age: Number,
    height: Number,
    bodyWeight: {
        type: Number,
        default: 0
    },
    height: {
        type: Number,
        default: 0
    },
    bmi: {
        type: Number,
        default: 0
    },
});

// UserSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', UserSchema);
module.exports = User;