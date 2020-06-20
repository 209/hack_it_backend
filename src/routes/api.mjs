import express from 'express';
import NodeGeocoder from 'node-geocoder';
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
  const posts = postsExampleRaw; // await postsAPI();
  const { items: itemsRaw } = posts;

  const items = itemsRaw.splice(0, 3);

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
      geoPlaces = await Promise.all(places.map(place => {
        return geocoder.geocode(place.value);
      }))
    }

    return {
      text,
      geoPlaces,
      places
    };
  }));

  console.log(result);

  res.send(JSON.stringify({
    items: result,
  }));
});


export default router;
