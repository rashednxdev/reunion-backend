import express from 'express';
import { adminAuth } from '../middleware/adminAuth.js';
import { getConfig, saveConfig, createBooking, getBookings } from '../controllers/singleChanceController.js';

const router = express.Router();

router.get('/', getConfig);
router.post('/setup', adminAuth, saveConfig);
router.post('/book', createBooking);
router.get('/bookings', adminAuth, getBookings);

export default router;
