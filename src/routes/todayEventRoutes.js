const express = require('express');
const multer = require('multer');
const { createTodayEvent, getAllTodayEvents, updateTodayEvent, deleteTodayEvent } = require('../controllers/todayEventController');
const authenticationMiddleware = require('../middleware/authenticationMiddleware');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/all', getAllTodayEvents);


router.use(authenticationMiddleware.authenticateUser,authenticationMiddleware.authorizeRoles(['admin']))
router.post('/create', upload.single('image'), createTodayEvent);
router.put('/:id', upload.single('image'), updateTodayEvent);
router.delete('/:id', deleteTodayEvent);

module.exports = router;

