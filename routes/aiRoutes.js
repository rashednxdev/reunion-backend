import express from 'express';
import { generateAnnouncement } from '../controllers/aiController.js';
import { adminAuth } from '../middleware/adminAuth.js';

const router = express.Router();

router.post('/generate', adminAuth, generateAnnouncement);

export default router;
