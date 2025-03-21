import express from 'express';
import assistantRouter from './assistant.js';
import authRouter from './auth.js';
import codeRouter from './code.js';
const router = express.Router();

router.use("/" , assistantRouter);
router.use("/" , authRouter);
router.use("/codebase", codeRouter);

export default router;