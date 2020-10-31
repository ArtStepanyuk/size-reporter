const path = require("path");

const errorPath = (name) => path.resolve(`./errors/${name}`);
const sizeResults = (name) => path.resolve(`./sizesResults/${name}`);
const sizeReports = (name) => path.resolve(`./sizesReports/${name}`);

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
  if (!obj) {
    return;
  }
  if (obj instanceof Array) {
    obj.forEach(function (item) {
      removeProps(item, keys);
    });
  } else if (typeof obj === "object") {
    Object.getOwnPropertyNames(obj).forEach(function (key) {
      if (keys.indexOf(key) !== -1) delete obj[key];
      else removeProps(obj[key], keys);
    });
  }
  return obj;
};

const roundNumbers = (obj, numberOfDecimals) => {
  if (!obj || !obj.result) {
    return;
  }

  const arrayMutator = (i, index, arr) => {
    if (typeof arr[index] === "number" && !Number.isNaN(i)) {
      arr[index] = parseFloat(i.toFixed(numberOfDecimals));
    }
  };

  if (obj.result._data) {
    for (let item of obj.result._data) {
      item.forEach(arrayMutator);
    }
  }

  if (obj.result.annulus) {
    for (let annu of obj.result.annulus) {
      for (let item of annu._data) {
        item.forEach(arrayMutator);
      }
    }
  }

  for (let i of ["annu", "pipe"]) {
    if (obj.result[i] && obj.result[i]._data) {
      for (let item of obj.result[i]._data) {
        item.forEach(arrayMutator);
      }
    }
  }

  return obj;
};

const propertiesToArray = (obj) => {

  const isObject = (val) => typeof val === "object" && !Array.isArray(val);

  const addDelimiter = (a, b) => (a ? `${a}.${b}` : b);

  const paths = (obj = {}, head = "") => {
    if(obj === null || obj === undefined) return 
    return Object.entries(obj).reduce((product, [key, value]) => {
      let fullPath = addDelimiter(head, key);
      return isObject(value)
        ? product.concat(paths(value, fullPath))
        : product.concat(fullPath);
    }, []);
  };

  return paths(obj);
};

module.exports = {
  sortObjByValues,
  formatBytes,
  sizeResults,
  sizeReports,
  errorPath,
  removeProps,
  roundNumbers,
  propertiesToArray,
};
