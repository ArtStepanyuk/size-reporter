const sizeof = require("object-sizeof");
const fs = require("fs").promises;
const { get } = require('lodash')
const {
  sizeReports,
  propertiesToArray,
  sortObjByValues
} = require("../helpers");

module.exports = async () => {
  let holder = {}
  const filenames = await fs.readdir("./results");
  for await (filename of filenames.filter(i => i !== '.gitkeep')) {
    const file = require(`../results/${filename}`)
    const paths = propertiesToArray(file)
    console.log(paths)
    for(let path of paths) {
      const size = sizeof(get(file, path));
      holder = { ...holder, [path]: size };
    }
    await fs.writeFile(sizeReports(filename), JSON.stringify(sortObjByValues(holder), null, 4));
  }
};