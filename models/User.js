const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "First name required."],
    },
    middleName: {
        type: String,
    },
    lastName: {
        type: String,
        required: [true, "Last name required."]
    },
    email: {
        type: String,
        required: [true, "Email required."]
    },
    mobile_no: {
        type: String,
        required: [true, "Mobile number required."]
    },
    password: {
        type: String,
        required: [true, "Password required."]
    },
}, {
    timestamps: true,
    versionKey: false,
});

module.exports = mongoose.model("User", userSchema);