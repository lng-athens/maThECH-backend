const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
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
        default: "teacher",
    },
}, {
    timestamps: true,
    versionKey: false,
});

module.exports = mongoose.model("Teacher", teacherSchema);