const Course = require('../models/Course');

exports.getCourses = async (req, res) => {
  try {
    const { department, category, search } = req.query;
    let filter = {};
    if (department) filter.department = department;
    if (category) filter.category = category;
    if (search) filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { code: { $regex: search, $options: 'i' } },
      { instructor: { $regex: search, $options: 'i' } }
    ];
    const courses = await Course.find(filter);
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.seedCourses = async (req, res) => {
  try {
    await Course.deleteMany({});
    const courses = [
      { code: 'CS101', name: 'Introduction to Computer Science', description: 'Fundamentals of programming and computational thinking.', credits: 3, department: 'Computer Science', instructor: 'Dr. Sarah Chen', schedule: { days: ['Monday', 'Wednesday'], time: '9:00 AM - 10:30 AM', room: 'CS-201' }, capacity: 40, semester: 'Fall 2025', prerequisites: [], category: 'Core' },
      { code: 'CS201', name: 'Data Structures & Algorithms', description: 'Arrays, linked lists, trees, graphs, sorting and searching algorithms.', credits: 3, department: 'Computer Science', instructor: 'Dr. James Park', schedule: { days: ['Tuesday', 'Thursday'], time: '11:00 AM - 12:30 PM', room: 'CS-301' }, capacity: 35, semester: 'Fall 2025', prerequisites: ['CS101'], category: 'Core' },
      { code: 'CS301', name: 'Web Development', description: 'Frontend and backend web technologies including HTML, CSS, JavaScript, and Node.js.', credits: 3, department: 'Computer Science', instructor: 'Prof. Maya Johnson', schedule: { days: ['Monday', 'Wednesday', 'Friday'], time: '1:00 PM - 2:00 PM', room: 'CS-105' }, capacity: 30, semester: 'Fall 2025', prerequisites: ['CS101'], category: 'Elective' },
      { code: 'CS401', name: 'Database Systems', description: 'Relational databases, SQL, NoSQL, and database design principles.', credits: 3, department: 'Computer Science', instructor: 'Dr. Ahmed Hassan', schedule: { days: ['Tuesday', 'Thursday'], time: '2:00 PM - 3:30 PM', room: 'CS-202' }, capacity: 35, semester: 'Fall 2025', prerequisites: ['CS201'], category: 'Core' },
      { code: 'MATH101', name: 'Calculus I', description: 'Limits, derivatives, and integrals of single-variable functions.', credits: 4, department: 'Mathematics', instructor: 'Prof. Elena Russo', schedule: { days: ['Monday', 'Wednesday', 'Friday'], time: '8:00 AM - 9:00 AM', room: 'MATH-101' }, capacity: 50, semester: 'Fall 2025', prerequisites: [], category: 'Core' },
      { code: 'MATH201', name: 'Linear Algebra', description: 'Vectors, matrices, linear transformations, and eigenvalues.', credits: 3, department: 'Mathematics', instructor: 'Dr. Robert Kim', schedule: { days: ['Tuesday', 'Thursday'], time: '9:00 AM - 10:30 AM', room: 'MATH-205' }, capacity: 40, semester: 'Fall 2025', prerequisites: ['MATH101'], category: 'Core' },
      { code: 'ENG101', name: 'English Composition', description: 'Academic writing, critical thinking, and research skills.', credits: 3, department: 'English', instructor: 'Prof. Laura Williams', schedule: { days: ['Monday', 'Wednesday'], time: '11:00 AM - 12:30 PM', room: 'HUM-301' }, capacity: 25, semester: 'Fall 2025', prerequisites: [], category: 'General Education' },
      { code: 'PHYS101', name: 'Physics I', description: 'Mechanics, motion, energy, and thermodynamics.', credits: 4, department: 'Physics', instructor: 'Dr. Michael Torres', schedule: { days: ['Tuesday', 'Thursday', 'Friday'], time: '10:00 AM - 11:00 AM', room: 'SCI-401' }, capacity: 45, semester: 'Fall 2025', prerequisites: ['MATH101'], category: 'Core' },
      { code: 'CS501', name: 'Machine Learning', description: 'Supervised and unsupervised learning, neural networks, and AI applications.', credits: 3, department: 'Computer Science', instructor: 'Dr. Priya Sharma', schedule: { days: ['Monday', 'Wednesday'], time: '3:00 PM - 4:30 PM', room: 'CS-401' }, capacity: 30, semester: 'Fall 2025', prerequisites: ['CS201', 'MATH201'], category: 'Elective' },
      { code: 'BUS101', name: 'Introduction to Business', description: 'Fundamentals of business management, marketing, and entrepreneurship.', credits: 3, department: 'Business', instructor: 'Prof. David Lee', schedule: { days: ['Tuesday', 'Thursday'], time: '1:00 PM - 2:30 PM', room: 'BUS-101' }, capacity: 60, semester: 'Fall 2025', prerequisites: [], category: 'General Education' }
    ];
    await Course.insertMany(courses);
    res.json({ message: 'Courses seeded successfully', count: courses.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
