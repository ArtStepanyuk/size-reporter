// const sizeof = require("sizeof");
const { cloneDeep } = require("lodash");
const sizeof = require("object-sizeof");
const fs = require("fs").promises;
const {
  errorPath,
  sizeResults,
  formatBytes,
  sortObjByValues,
  roundNumbers,
  removeProps,
} = require("../helpers");
const decimalsToRound = require('../constants').decimalsToRound

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

module.exports = async () => {
  const filenames = await fs.readdir("./results");
  for await (filename of filenames.filter(i => i !== '.gitkeep')) {
    const file = require(`../results/${filename}`)
    const fileCopy1 = cloneDeep(file)
    const fileCopy2 = cloneDeep(file)
    await prepareResults(file, filename);
    const cleanFile = removeProps(fileCopy1, ['headers', 'combined'])
    await prepareResults(cleanFile, `no-headers-no-combined-${filename}`);
    const roundedFile = roundNumbers(fileCopy2, decimalsToRound)
    await prepareResults(roundedFile, `rounded-by-${decimalsToRound}-${filename}`);
  }
};