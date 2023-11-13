const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
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
    password: {
        type: String,
        required: [true, "Password required."]
    },
    role: {
        type: String,
        default: "student",
    },
}, {
    timestamps: true,
    versionKey: false,
});

module.exports = mongoose.model("Student", studentSchema);