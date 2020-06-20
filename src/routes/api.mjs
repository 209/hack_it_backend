import express from 'express';
import NodeGeocoder from 'node-geocoder';
import getDistance from 'geolib/es/getDistance.js';
import PostModel from '../model/Post.mjs';
import postsAPI from '../api/posts.mjs';

const geocoder = NodeGeocoder({
  provider:  'google',
  // Optional depending on the providers
  apiKey:    process.env.GOOGLE_API_KEY,
  formatter: null,
  language:  'ru',
});

const router = express.Router();

router.get('/posts_raw', async function (req, res, next) {
  const posts = await postsAPI();
  res.send(JSON.stringify(posts));
});

router.get('/posts_read', async function (req, res, next) {
  const onlyNew = req.param("onlyNew") || true;
  const count = req.param("count") || 5;
  const params = {};
  if (onlyNew) {
    params.label = "unread";
  }

  const posts = await PostModel.find(params)
    .sort({ date: -1 })
    .limit(+count);

  res.send(JSON.stringify({ items: posts }));
});

router.get('/posts', async function (req, res, next) {
  const geo = req.param("geo");
  const distance = req.param("distance") || 3000;
  const onlyNew = req.param("onlyNew") || true;
  const count = req.param("count") || 5;
  const params = {};
  if (onlyNew) {
    params.label = "unread";
  }

  let userGEO;
  if (geo) {
    const userGEOs = await geocoder.geocode(geo);
    userGEO = userGEOs[0];
  }
  let posts = await PostModel.find(params)
    .sort({ date: -1 })
    .limit(+count);

  if (onlyNew) {
    posts.forEach(({ id }) => {
      PostModel.findOneAndUpdate({ id }, { "label": "read" });
    })
  }

  if (userGEO) {
    posts = posts.map(post => {
      const { geoData } = post;

      post.geoData = geoData.map(geoDataItem => {
        const { geo: { latitude, longitude } } = geoDataItem;
        const distance = getDistance.default(
          { latitude, longitude },
          { latitude: userGEO.latitude, longitude: userGEO.longitude }
        );
        return {
          ...geoDataItem,
          distance
        };
      });
    });
  }

  // filtering by distance
  if (userGEO) {
    posts = posts.filter(item => {
      // если не определили GEO - не отображаем
      if (!item.geoData || item.geoData.length === 0) {
        return false;
      }

      return item.geoData.filter(geoDataItem => {
        // если нет дистанции, то не отоборажаем
        if (geoDataItem.distance === null) {
          return false;
        }
        return geoDataItem.distance < distance;
      }).length > 0;
    });
  }

  // preparing
  posts = posts.map(item => ({
    text:          item.text,
    geoDataString: item.geoData && item.geoData.map(place => place.value).join("; "),
    link:          '',
  }))

  res.send(JSON.stringify({
    items: posts,
  }));
});


export default router;
