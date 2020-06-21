import NodeGeocoder from 'node-geocoder';

const geocoder = NodeGeocoder({
  provider:  'google',
  // Optional depending on the providers
  apiKey:    process.env.GOOGLE_API_KEY,
  formatter: null,
  language:  'ru',
});

export default async geoData => {
  let places = [];
  if (geoData.ADDRESS.length) {
    places = geoData.ADDRESS;
  } else if (geoData.STREET.length) {
    places = geoData.STREET;
  } else if (geoData.GEO.length) {
    places = geoData.GEO;
  }

  if (!places.length) {
    return [];
  }

  return Promise.all(places.map(async place => {
    const response = await geocoder.geocode(place.value);

    if (response.length) {
      const { latitude, longitude } = response[0];
      return { ...place, geo: { latitude, longitude } };
    } else {
      return { ...place, geo: null };
    }
  }));
}
