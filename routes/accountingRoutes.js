import express from 'express';
import { adminAuth } from '../middleware/adminAuth.js';
import {
  getExpenditureTypes,
  createExpenditureType,
  deleteExpenditureType,
  getExpenditures,
  createExpenditure,
  deleteExpenditure,
  getAccountingSummary,
} from '../controllers/accountingController.js';

const router = express.Router();

// All accounting routes require admin auth
router.use(adminAuth);

// Summary
router.get('/summary', getAccountingSummary);

// Expenditure Types
router.get('/types', getExpenditureTypes);
router.post('/types', createExpenditureType);
router.delete('/types/:id', deleteExpenditureType);

// Expenditures
router.get('/expenditures', getExpenditures);
router.post('/expenditures', createExpenditure);
router.delete('/expenditures/:id', deleteExpenditure);

export default router;
