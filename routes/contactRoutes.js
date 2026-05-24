import express from 'express';
import { adminAuth } from '../middleware/adminAuth.js';
import {
  getContactTypes,
  createContactType,
  updateContactType,
  deleteContactType,
  addContactEntry,
  updateContactEntry,
  deleteContactEntry
} from '../controllers/contactController.js';

const router = express.Router();

router.get('/', getContactTypes);
router.post('/', adminAuth, createContactType);
router.put('/:id', adminAuth, updateContactType);
router.delete('/:id', adminAuth, deleteContactType);

router.post('/:id/entries', adminAuth, addContactEntry);
router.put('/:id/entries/:entryId', adminAuth, updateContactEntry);
router.delete('/:id/entries/:entryId', adminAuth, deleteContactEntry);

export default router;
