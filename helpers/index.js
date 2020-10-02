const path = require("path");

const errorPath = (name) => path.resolve(`./errors/${name}`);
const sizeResults = (name) => path.resolve(`./sizesResults/${name}`);

const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

const sortObjByValues = (obj) => {
  const sortable = Object.entries(obj)
    .sort(([, a], [, b]) => b - a)
    .reduce((r, [k, v]) => ({ ...r, [k]: formatBytes(v) }), {});
  return sortable;
};

const removeProps = (obj, keys) => {
  if(!obj) {
    return
  }
  if(obj instanceof Array){
    obj.forEach(function(item){
      removeProps(item,keys)
    });
  }
  else if(typeof obj === 'object'){
    Object.getOwnPropertyNames(obj).forEach(function(key){
      if(keys.indexOf(key) !== -1)delete obj[key];
      else removeProps(obj[key],keys);
    });
  }
  return obj
}

module.exports = {
  sortObjByValues,
  formatBytes,
  sizeResults,
  errorPath,
  removeProps
};
