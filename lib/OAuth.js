const request = require('request');
const fs = require('fs');
const path = require('path');

const baseUrl = 'https://aip.baidubce.com/oauth/2.0/token';
// var cache = {
//   createdAt:0,
//   token: null
// };
var cache = null;

function __getToken(key, secrect){
  let promise = new Promise((resolve, reject) => {
    let url = `${baseUrl}?grant_type=client_credentials&client_id=${key}&client_secret=${secrect}`;
    request(url, (err, response, body) => {
      if(err){
        return reject(err);
      }
      if(response.statusCode != 200){
        return reject(new Error('response status code ' + response.statusCode));
      }
      let info = JSON.parse(body);
      if(info.error){
        reject(new Error(info.error));
      }
      resolve(info);
    })
  });
  return promise;
}

function __loadCache(key){
  var promise = new Promise((resolve, reject) =>{
    let filepath = path.join(__dirname, key, 'cache.json');
    fs.stat(filepath, (err) => {
      if(err){
        return resolve({});
      }
      resolve(require(filepath));
    })
  })
  return promise;
}

function __saveCache(key){
  let filepath = path.join(__dirname, key, 'cache.json');
  fs.writeFileSync(filepath, JSON.stringify(cache));
}

exports.getToken = (key, secrect) => {
  let promise = new Promise(async (resolve, reject) => {
    let now = Math.floor(Date.now() / 1000);
    try{
      if(!cache || now - cache.createdAt >= cache.token.expires_in){
        cache = await __loadCache(key);
      }
      if(!cache.token || now - cache.createdAt >= cache.token.expires_in){
        cache.token = await __getToken(key, secrect)
        cache.createdAt = now;
        __saveCache(cache);
      }
      resolve(cache.token);
    }catch(err){
      reject(err);
    }
  })
  return promise;
}

exports.refreshToken = (key, secrect) => {
  cache = null;
  return exports.getToken(key, secrect);
}