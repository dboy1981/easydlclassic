const ApiRequest = require('./lib/ApiRequest');

function EasyDLApi(key, secrect){
  var req = ApiRequest(key, secrect);

  return {
    dataset_list: async (options = {}) => {
      var def = {
        type: 'IMAGE_CLASSIFICATION',
        start: 0,
        num: 100
      }
      var opts = Object.assign({}, def, options);
      var ret = null;
      try{
        ret = await req.post('https://aip.baidubce.com/rpc/2.0/easydl/dataset/list', opts);
      }catch(err){
        return err;
      }
      return ret;
    },
  
    label_list: async (options = {}) => {
      var def = {
        type: 'IMAGE_CLASSIFICATION',
        start: 0,
        num: 100,
        dataset_id:0
      }
      var opts = Object.assign({}, def, options);
      if(!opts.dataset_id){
        throw new Error('dataset_id error.');
      }
      var ret = null;
      try{
        ret = await req.post('https://aip.baidubce.com/rpc/2.0/easydl/label/list', opts);
      }catch(err){
        return err;
      }
      return ret;
    },
  
    addentity: async (options = {}) => {
      var def = {
        type: 'IMAGE_CLASSIFICATION',
        appendLabel: true,
        dataset_id: 0,
        entity_content: '',
        entity_name: ''
      }
      var opts = Object.assign({}, def, options);
      if(!opts.dataset_id || !opts.entity_content || !opts.entity_name){
        throw new Error('options error.');
      }
      var ret = null;
      try{
        ret = await req.post('https://aip.baidubce.com/rpc/2.0/easydl/dataset/addentity', opts);
      }catch(err){
        return err;
      }
      return ret;
    },
  
    dataset_delete: async (options = {}) => {
      var def = {
        type: 'IMAGE_CLASSIFICATION',
        dataset_id:0
      }
      var opts = Object.assign({}, def, options);
      if(!opts.dataset_id){
        throw new Error('dataset_id error.');
      }
      var ret = null;
      try{
        ret = await req.post('https://aip.baidubce.com/rpc/2.0/easydl/dataset/delete', opts);
      }catch(err){
        return err;
      }
      return ret;
    },
  
    label_delete: async (options = {}) => {
      var def = {
        type: 'IMAGE_CLASSIFICATION',
        dataset_id:0,
        label_name:''
      }
      var opts = Object.assign({}, def, options);
      if(!opts.dataset_id || !opts.label_name){
        throw new Error('options error.');
      }
      var ret = null;
      try{
        ret = await req.post('https://aip.baidubce.com/rpc/2.0/easydl/label/delete', opts);
      }catch(err){
        return err;
      }
      return ret;
    },
  
    imageclass_query: async (url, options) => {
      var def = {
        image: '',
        top_num:5
      }
      var opts = Object.assign({}, def, options);
      if(!opts.image || !url){
        throw new Error('options error.');
      }
      var ret = null;
      try{
        ret = await req.post(url, opts);
      }catch(err){
        return err;
      }
      return ret;
    }
  }
}

module.exports = EasyDLApi;