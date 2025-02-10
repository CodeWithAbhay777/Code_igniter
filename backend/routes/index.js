import express from 'express';
import assistantRouter from './assistant.js';
import authRouter from './auth.js';
const router = express.Router();

router.use("/" , assistantRouter);
router.use("/" , authRouter);

export default router;