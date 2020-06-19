import express from 'express';

const router = express.Router();

router.get('/', function (req, res, next) {
  res.send(JSON.stringify({title: 'index page'}));
});

export default router;
