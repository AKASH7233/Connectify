import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Hello from chat route');
});

router.post('/',createChat);
router.get('/:userId',userChats);
router.get('/find/:firstUserId/:secondUserId',findChat);

export default router;