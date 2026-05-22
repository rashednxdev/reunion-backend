import express from 'express';
import { getOpinions, createOpinion } from '../controllers/opinionController.js';

const router = express.Router();

router.get('/', getOpinions);
router.post('/', createOpinion);

export default router;
