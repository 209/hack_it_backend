import express from 'express';
import postsAPI from '../api/posts.mjs';

const router = express.Router();

router.get('/posts', async function (req, res, next) {
  const posts = await postsAPI();
  res.send(JSON.stringify(posts));
});

export default router;
