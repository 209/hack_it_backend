import express from 'express';
import ProcessClass from '../vendor/PullentiJavascript/process.js';
import postsAPI from '../api/posts.mjs';

const router = express.Router();

router.get('/posts_raw', async function (req, res, next) {
  const posts = await postsAPI();
  res.send(JSON.stringify(posts));
});

router.get('/posts', async function (req, res, next) {
  const posts = await postsAPI();
  const { items } = posts;

  const result = items.map(item => {
    const { text } = item;
    const entities = ProcessClass.process(text);
    const additional = [];
    for (const e of entities) {
      const entity = {
        type: e.type_name,
        value: e.toString(),
        slots: [],
      };
      // for (const s of e.slots) {
      //   entity.slots.push({
      //     type: s.type_name,
      //     value: s.value,
      //   });
      // }
      additional.push(entity);
    }

    console.log(additional);

    return {
      text,
      additional
    };
  });

  res.send(JSON.stringify({
    items: result,
  }));
});


export default router;
