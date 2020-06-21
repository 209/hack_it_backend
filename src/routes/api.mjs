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
    .limit(60);

  posts = posts.map(post => post.toObject());

  if (onlyNew) {
    posts.forEach(({ id }) => {
      PostModel.findOneAndUpdate({ id }, { "label": "read" });
    })
  }

  let updatedPost = posts;
  if (userGEO) {
    updatedPost = posts.map(post => {
      const { geoData } = post;

      const newGeoData = geoData.map(geoDataItem => {
        const { geo } = geoDataItem;
        console.log('geo', geo);
        if (!geo) {
          return { ...geoDataItem };
        }

        const { latitude, longitude } = geo;
        const distance = getDistance.default(
          { latitude, longitude },
          { latitude: userGEO.latitude, longitude: userGEO.longitude }
        );
        console.log('distance', distance);
        return {
          ...geoDataItem,
          distance
        };
      });

      console.log('newGeoData', newGeoData);

      return {
        ...post,
        geoData: newGeoData,
      };
    });
  }

  console.log('posts[geoData]', posts.map(item => item.geoData));

  // filtering by distance
  let updatedPost2 = updatedPost;
  if (userGEO) {
    updatedPost2 = updatedPost.filter(item => {
      console.log('item.geoData', item.geoData);
      // если не определили GEO - не отображаем
      if (!item.geoData || item.geoData.length === 0) {
        return false;
      }

      return item.geoData.filter(geoDataItem => {
        console.log('geoDataItem.distance', geoDataItem.distance);
        // если нет дистанции, то не отоборажаем
        if (geoDataItem.distance === null) {
          return false;
        }
        return geoDataItem.distance < distance;
      }).length > 0;
    });
  }

  // preparing
  const updatedPost3 = updatedPost2.map(item => ({
    text:          item.text,
    geoDataString: item.geoData && item.geoData.map(place => place.value).join("; "),
    link:          `https://vk.com/wall${item.owner_id}_${item.id}`,
  }))

  res.send(JSON.stringify({
    items: updatedPost3.splice(0, +count),
  }));
});


export default router;
