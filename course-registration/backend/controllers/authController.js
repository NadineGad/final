const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

exports.register = async (req, res) => {
  try {
    const { fullName, email, password, studentId, major, year } = req.body;
    const existing = await User.findOne({ $or: [{ email }, { studentId }] });
    if (existing) return res.status(400).json({ message: 'Email or Student ID already exists' });

    const user = await User.create({ fullName, email, password, studentId, major, year });
    const token = generateToken(user._id);
    res.status(201).json({ token, user: { id: user._id, fullName: user.fullName, email: user.email, studentId: user.studentId, major: user.major, year: user.year } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(400).json({ message: 'Invalid email or password' });

    const token = generateToken(user._id);
    res.json({ token, user: { id: user._id, fullName: user.fullName, email: user.email, studentId: user.studentId, major: user.major, year: user.year } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMe = async (req, res) => {
  res.json(req.user);
};
