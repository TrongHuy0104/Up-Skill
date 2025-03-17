import express from 'express';
import { createRequest } from '@/controllers/request.controller';

const router = express.Router();

router.post('/create-request', createRequest);

export = router;
