import express from 'express';
import { createRegistration, getAllRegistrations, getStats, exportCSV } from '../controllers/registrationController.js';
import { adminAuth } from '../middleware/adminAuth.js';

const router = express.Router();

router.post('/', createRegistration);                  // Public
router.get('/stats', adminAuth, getStats);             // Admin
router.get('/export', adminAuth, exportCSV);           // Admin
router.get('/', adminAuth, getAllRegistrations);        // Admin

export default router;
