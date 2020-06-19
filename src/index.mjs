import pkg from 'vk-io';
import groups from './config/groups.mjs';

const { VK } = pkg;
const vk = new VK({ token: process.env.VK_APP_TOKEN });
const { api } = vk;
const { ids: groupIds } = groups;

api.wall.get({
  owner_id: -groupIds[0],
  count: 2,
})
  .then(response => {
    console.log("response", response);
    console.log("attachments", response.items[0].attachments)
  })
  .catch(error => console.log(error));
