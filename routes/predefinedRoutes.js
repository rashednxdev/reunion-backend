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
  getOfficeNames,
  createOfficeName,
  deleteOfficeName,
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

// Office Names (DCA / DAFO / UAO)
router.route('/office-names')
  .get(getOfficeNames)
  .post(adminAuth, createOfficeName);
router.route('/office-names/:id')
  .delete(adminAuth, deleteOfficeName);

export default router;
