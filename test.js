const API = require('./index')('test', 'test');

API.dataset_list().then((ret) => {
  console.log(ret);
}).catch((err) => {
  console.log(err);
})