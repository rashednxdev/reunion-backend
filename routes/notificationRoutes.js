import express from 'express';
import { createNotification, getAllNotifications } from '../controllers/notificationController.js';
import { adminAuth } from '../middleware/adminAuth.js';

const router = express.Router();

router.post('/', adminAuth, createNotification);
router.get('/', adminAuth, getAllNotifications);

export default router;
