const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'dropped'], default: 'confirmed' },
  registeredAt: { type: Date, default: Date.now },
  semester: { type: String, required: true },
  notes: { type: String }
});

registrationSchema.index({ student: 1, course: 1 }, { unique: true });

module.exports = mongoose.model('Registration', registrationSchema);
