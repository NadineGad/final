const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  credits: { type: Number, required: true },
  department: { type: String, required: true },
  instructor: { type: String, required: true },
  schedule: {
    days: [{ type: String }],
    time: { type: String },
    room: { type: String }
  },
  capacity: { type: Number, required: true },
  enrolled: { type: Number, default: 0 },
  semester: { type: String, required: true },
  prerequisites: [{ type: String }],
  category: { type: String, required: true }
});

module.exports = mongoose.model('Course', courseSchema);
