const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const authenticate = require('../middleware/authMiddleware');
 // assume you have authentication middleware

// GET /settings/:userId - get settings for a user
router.get('/:userId', authenticate, settingsController.getSettings);

// POST /settings - create new settings record
router.post('/', authenticate, settingsController.createSettings);

// PUT /settings/:userId - update user settings
router.put('/:userId', authenticate, settingsController.updateSettings);

module.exports = router;
