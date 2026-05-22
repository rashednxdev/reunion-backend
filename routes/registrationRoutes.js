import express from 'express';
import { createRegistration, getAllRegistrations, getStats, getPublicStats, exportCSV, checkRegistration, updateRegistrationStatus, assignSerialNumbers, getDrawCandidates, syncUserOffices } from '../controllers/registrationController.js';
import { adminAuth } from '../middleware/adminAuth.js';

const router = express.Router();

router.post('/', createRegistration);                  // Public
router.get('/check/:mobile', checkRegistration);       // Public
router.get('/public-stats', getPublicStats);           // Public
router.get('/draw-candidates', getDrawCandidates);     // Public
router.get('/stats', adminAuth, getStats);             // Admin
router.get('/export', adminAuth, exportCSV);           // Admin
router.get('/', adminAuth, getAllRegistrations);        // Admin
router.patch('/:id/status', adminAuth, updateRegistrationStatus); // Admin
router.post('/assign-serials', adminAuth, assignSerialNumbers);   // Admin
router.post('/sync-user-offices', adminAuth, syncUserOffices);     // Admin

export default router;
