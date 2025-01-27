import express from 'express';
import assistantRouter from './assistant.js';
const router = express.Router();

router.use("/" , assistantRouter);

export default router;