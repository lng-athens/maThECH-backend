const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({});

module.exports = mongoose.model("Teacher", teacherSchema);