const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// All member CRUD routes require auth token
router.get('/', authMiddleware, memberController.getAllMembers);
router.get('/:id', authMiddleware, memberController.getMemberById);
router.post('/', authMiddleware, upload.single('photo'), memberController.createMember);
router.put('/:id', authMiddleware, upload.single('photo'), memberController.updateMember);
router.delete('/:id', authMiddleware, memberController.deleteMember);

module.exports = router;
