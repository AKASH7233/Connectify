import express from 'express';
import { createChat,userChats } from '../controllers/ChatController.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Hello from chat route');
});

router.post('/chat',createChat);
router.get('/:userId',userChats);
// router.get('/find/:firstUserId/:secondUserId',findChat);

export default router;