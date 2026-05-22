const Registration = require('../models/Registration');
const Course = require('../models/Course');

exports.register = async (req, res) => {
  try {
    const { courseId, notes } = req.body;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    if (course.enrolled >= course.capacity) return res.status(400).json({ message: 'Course is full' });

    const existing = await Registration.findOne({ student: req.user._id, course: courseId });
    if (existing) return res.status(400).json({ message: 'Already registered for this course' });

    const registration = await Registration.create({
      student: req.user._id,
      course: courseId,
      semester: course.semester,
      notes
    });

    await Course.findByIdAndUpdate(courseId, { $inc: { enrolled: 1 } });
    await registration.populate('course');
    res.status(201).json(registration);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({ student: req.user._id, status: { $ne: 'dropped' } }).populate('course');
    res.json(registrations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.drop = async (req, res) => {
  try {
    const registration = await Registration.findOne({ _id: req.params.id, student: req.user._id });
    if (!registration) return res.status(404).json({ message: 'Registration not found' });

    registration.status = 'dropped';
    await registration.save();
    await Course.findByIdAndUpdate(registration.course, { $inc: { enrolled: -1 } });
    res.json({ message: 'Course dropped successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
