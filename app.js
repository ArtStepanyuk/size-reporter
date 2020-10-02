// const sizeof = require("sizeof");
const sizeof = require("object-sizeof");
const fs = require("fs").promises;
const {
  errorPath,
  sizeResults,
  formatBytes,
  sortObjByValues,
} = require("./helpers");

const prepareResults = async (resultObject, filename) => {
  let holder = {};
  let errors = [];
  let totalSize = sizeof(resultObject);

  const updateHolder = (obj, key) => {
    const size = sizeof(obj[key]);
    holder = { ...holder, [key]: size };
  };

  const getValuesSize = (obj) => {
    try {
      const keys = Object.keys(obj);
      for (let key of keys) {
        updateHolder(obj, key);
        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
          getValuesSize(obj[key]);
        }
        if (Array.isArray(obj[key])) {
          updateHolder(obj, key);
        }
      }
    } catch (err) {
      errors.push(err);
    }
  };

  getValuesSize(resultObject);
  await fs.writeFile(
    sizeResults(filename),
    JSON.stringify(sortObjByValues({...holder, totalSize}), null, 4)
  );
  await fs.writeFile(errorPath(filename), JSON.stringify(errors, null, 4));
};

(async () => {
  const filenames = await fs.readdir("./results");
  for await (filename of filenames) {
    await prepareResults(require(`./results/${filename}`), filename);
  }
})();
