import postsAPI from '../api/posts.mjs';
import PostModel from '../model/Post.mjs';
import parseGEO from '../helpers/parseGEO.mjs';
import geoAPI from '../api/geo.mjs';

const TIMEOUT = 300000;

class Watch {
  init() {
    PostModel.deleteMany().then(() => {
      this.task().then(() => this.schedule());
    });
  }

  stop() {
    clearTimeout(this.timeoutId);
    this.timeoutId = null;
  }

  schedule() {
    this.timeoutId = setTimeout(() => {
      this.task().then(() => this.schedule());
    }, TIMEOUT);
  }

  task() {
    return postsAPI().then(async response => {
      const { items } = response;

      for await (let item of items) {
        const savedModel = await PostModel.find({ id: item.id });

        if (!savedModel.length) {
          console.log('create: ', item.id);
          const rawGeoData = parseGEO(item.text);
          console.log('rawGeoData', rawGeoData);
          const geoData = await geoAPI(rawGeoData);
          console.log('geoData', geoData);

          await PostModel.create({
            ...item,
            geoData,
            label: "unread",
          });
        } else if (item.edited !== savedModel.edited) {
          console.log('update: ', item.id);
          await PostModel.findOneAndUpdate({ id: item.id }, item);
        }
      }
    });
  }
}

export default Watch;
