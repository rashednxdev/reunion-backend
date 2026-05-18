import express from 'express';
import { createRegistration, getAllRegistrations, getStats, exportCSV, checkRegistration, updateRegistrationStatus } from '../controllers/registrationController.js';
import { adminAuth } from '../middleware/adminAuth.js';

const router = express.Router();

router.post('/', createRegistration);                  // Public
router.get('/check/:mobile', checkRegistration);       // Public
router.get('/stats', adminAuth, getStats);             // Admin
router.get('/export', adminAuth, exportCSV);           // Admin
router.get('/', adminAuth, getAllRegistrations);        // Admin
router.patch('/:id/status', adminAuth, updateRegistrationStatus); // Admin

export default router;
