const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const protectedRoutes = require('./routes/protected');
const userRoutes = require('./routes/user');
const courseRoutes = require('./routes/courseRoutes');
const userCourseRoutes = require('./routes/userCourseRoutes');
const studyGroupRoutes = require('./routes/studyGroupsRoutes');
const groupMembersRoutes = require('./routes/groupMembersRoutes');
const studySessionRoutes = require('./routes/studySessionRoutes');
const messageRoutes = require('./routes/messageRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const settingsRoutes = require('./routes/settingsRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api', protectedRoutes);
app.use('/api/user', userRoutes);
// Serve uploaded files
app.use('/uploads', express.static('uploads'));
app.use('/api/courses', courseRoutes);
app.use('/api/user-courses', userCourseRoutes);
app.use('/api', studyGroupRoutes);
app.use('/api/group-members', groupMembersRoutes);
app.use('/api', studySessionRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/settings', settingsRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
