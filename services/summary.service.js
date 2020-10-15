const fs = require('fs').promises
const path = require('path');
const decimalsToRound = require('../constants').decimalsToRound

module.exports = async () => {
  const filenames = await fs.readdir("./results");
  const resultFiles = filenames.filter(i => i !==  '.gitkeep')
  for await(let filename of resultFiles) {
    try {
    
      const file = require(path.resolve(__dirname, `../sizesResults/${filename}`))
      const fileNoHeaders = require(path.resolve(__dirname, `../sizesResults/no-headers-no-combined-${filename}`))
      const fileRounded = require(path.resolve(__dirname, `../sizesResults/rounded-by-${decimalsToRound}-${filename}`))

      const combined = Object.keys(file).reduce((acc, key) => {
        return {...acc, [key]: `${file[key]}|${fileNoHeaders[key]}|${fileRounded[key]}`}
      }, {})

      await fs.writeFile(path.resolve(__dirname, `../summaryReport/${filename}`),
        JSON.stringify(combined, null, 4)
      );

    } catch(err) {
      console.error(err)
    }
  }
};
