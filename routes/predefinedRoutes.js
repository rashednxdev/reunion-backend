import express from 'express';
import {
  getOfficeTypes,
  createOfficeType,
  deleteOfficeType,
  getDivisions,
  createDivision,
  deleteDivision,
  getDistricts,
  createDistrict,
  deleteDistrict,
  getUpazilas,
  createUpazila,
  deleteUpazila,
} from '../controllers/predefinedController.js';
import { adminAuth } from '../middleware/adminAuth.js';

const router = express.Router();

// Office Types
router.route('/office-types')
  .get(getOfficeTypes)
  .post(adminAuth, createOfficeType);
router.route('/office-types/:id')
  .delete(adminAuth, deleteOfficeType);

// Divisions
router.route('/divisions')
  .get(getDivisions)
  .post(adminAuth, createDivision);
router.route('/divisions/:id')
  .delete(adminAuth, deleteDivision);

// Districts
router.route('/districts')
  .get(getDistricts)
  .post(adminAuth, createDistrict);
router.route('/districts/:id')
  .delete(adminAuth, deleteDistrict);

// Upazilas
router.route('/upazilas')
  .get(getUpazilas)
  .post(adminAuth, createUpazila);
router.route('/upazilas/:id')
  .delete(adminAuth, deleteUpazila);

export default router;
