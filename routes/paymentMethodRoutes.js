import express from 'express';
import {
  getPaymentMethods,
  createPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod
} from '../controllers/paymentMethodController.js';
import { adminAuth } from '../middleware/adminAuth.js';

const router = express.Router();

router.route('/')
  .get(getPaymentMethods)
  .post(adminAuth, createPaymentMethod);

router.route('/:id')
  .put(adminAuth, updatePaymentMethod)
  .delete(adminAuth, deletePaymentMethod);

export default router;
