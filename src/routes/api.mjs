import express from 'express';
import NodeGeocoder from 'node-geocoder';
import getDistance from 'geolib/es/getDistance.js';
import ProcessClass from '../vendor/PullentiJavascript/process.js';
import MorphLang from "../vendor/PullentiJavascript/pullenti/morph/MorphLang.js";
import postsAPI from '../api/posts.mjs';
import postsExampleRaw from '../fixtures/posts_example_raw.mjs';

const geocoder = NodeGeocoder({
  provider: 'google',
  // Optional depending on the providers
  apiKey: process.env.GOOGLE_API_KEY,
  formatter: null,
  language: 'ru',
});

const router = express.Router();

router.get('/posts_raw', async function (req, res, next) {
  const posts = await postsAPI();
  res.send(JSON.stringify(posts));
});

router.get('/posts', async function (req, res, next) {
  const geo = req.param("geo");

  console.log('geo', geo);

  const distance = req.param("distance") || 3000;
  let userGEOs = null;
  let userGEO;
  if (geo) {
    userGEOs = await geocoder.geocode(geo);
    userGEO = userGEOs[0];
  }
  const posts = postsExampleRaw; // await postsAPI();
  const { items } = posts;
  // const items = itemsRaw.splice(0, 3);

  const result = await Promise.all(items.map(async item => {
    const { text } = item;
    const entities = ProcessClass.process(text);
    const additional = {
      GEO: [],
      STREET: [],
      ADDRESS: [],
    };
    for (const e of entities) {
      additional[e.type_name].push({
        value: e.to_string(false, MorphLang.RU, 0),
        shortValue: e.to_string(true, MorphLang.RU, 0) || '',
      });
    }

    let places = null;
    if (additional.ADDRESS.length) {
      places = additional.ADDRESS;
    } else if (additional.STREET.length) {
      places = additional.STREET;
    }else if (additional.GEO.length) {
      places = additional.GEO;
    }

    let geoPlaces = [];

    if (places) {
      geoPlaces = await Promise.all(places.map(async place => {
        let pl;
        try {
          pl = await geocoder.geocode(place.value);
        } catch (e) {
          debugger;
          return {
            distance: Infinity,
          };
        }

        let distance = null;
        if (userGEO) {
          distance = getDistance.default(
            { latitude: pl[0].latitude, longitude: pl[0].longitude },
            { latitude: userGEO.latitude, longitude: userGEO.longitude }
          );
        }

        return {
          ...pl[0],
          distance,
        };
      }))
    }

    return {
      text,
      geoPlaces,
      places,
    };
  }));

  let filteredResult;
  if (userGEO) {
    filteredResult = result.filter(item => {
      if (!item.geoPlaces || item.geoPlaces.length === 0) {
        return false;
      }

      return item.geoPlaces.filter(pl => {
        if (pl.distance === null) {
          return false;
        }
        return pl.distance < distance;
      }).length > 0;
    });
  } else {
    filteredResult = result;
  }

  res.send(JSON.stringify({
    items: filteredResult.map(item => ({
      text: item.text,
      places: item.places && item.places.map(place => place.value).join("; "),
    })),
  }));
});


export default router;
