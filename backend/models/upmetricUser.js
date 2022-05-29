const mongoose = require('mongoose');
const { Schema } = mongoose;

const GuserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    gmail: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    img: {
        type: String,
        default: "https://www.mantruckandbus.com/fileadmin/_processed_/7/1/csm_Richard_von_Braunschweig_2a0347f46a.jpeg"
    },
    dob: {
        type: String,
        default: "Please update Your Date of birth"
    },
    isverified: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: Date.now
    },
});
const upmetricUser = mongoose.model('upmetricUser', GuserSchema);
module.exports = upmetricUser;