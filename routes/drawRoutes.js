import express from 'express';
import { adminAuth } from '../middleware/adminAuth.js';
import {
  getDrawConfig,
  addRange, deleteRange, updateRange,
  addPrize, deletePrize, updatePrize,
  recordWinner, resetDraw,
} from '../controllers/drawController.js';

const router = express.Router();

router.get('/', getDrawConfig);                         // Public – draw page
router.post('/ranges', adminAuth, addRange);              // Admin
router.patch('/ranges/:rangeId', adminAuth, updateRange); // Admin
router.delete('/ranges/:rangeId', adminAuth, deleteRange); // Admin
router.post('/prizes', adminAuth, addPrize);              // Admin
router.patch('/prizes/:prizeId', adminAuth, updatePrize); // Admin
router.delete('/prizes/:prizeId', adminAuth, deletePrize); // Admin
router.post('/record-winner', adminAuth, recordWinner);   // Admin
router.post('/reset', adminAuth, resetDraw);              // Admin

export default router;
