const request = require('request');
const OAuth = require('./OAuth');

function ApiRequest(key, secrect){
  async function get_accesstoken() {
    var token = null;
    try{
      token = await OAuth.getToken(key, secrect);
    }catch(err){
      throw err;
    }
    return token;
  }

  return {
    get_accesstoken: get_accesstoken,

    post:(url, data, repeat = 1) => {
      var promise = new Promise(async (resolve, reject) => {
        var token = null;
        try{
          token = await get_accesstoken();
        }catch(err){
          return reject(err);
        }
        
        if(token == null){
          reject(new Error('get token error'))
        }
    
        var options = {
          method: 'POST',
          uri: `${url}?access_token=${token.access_token}`,
          headers: {
            'Content-Type': 'application/json'
          },
          form:data
        }
    
        var callback = async (err, response, body) => {
          if(err){
            return reject(err);
          }
          if(response.statusCode != 200){
            return reject(new Error('response status code ' + response.statusCode));
          }
          var info = JSON.parse(body);
          //accesstoken 过期，刷新后重新请求
          if(info.error_code == 110 && repeat == 1){
            OAuth.refreshToken(key, secrect);
            try{
              let ret = await post(url, data, 0)
              resolve(ret);
            }catch(err){
              reject(err);
            }
            return;
          }
    
          resolve(info);
        }
    
        request(options, callback);
    
      });
      return promise;
      
    }
  }
}

module.exports = ApiRequest;