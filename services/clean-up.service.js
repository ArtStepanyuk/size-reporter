const fs = require('fs').promises
const path = require('path');

module.exports = async () => {
  const filenames = await fs.readdir("./sizesResults");
  for await(let file of filenames) {
    try {
      if(file !== '.gitkeep') {
        await fs.unlink(path.resolve(__dirname, `../sizesResults/${file}`))
        await fs.unlink(path.resolve(__dirname, `../errors/${file}`))
        await fs.unlink(path.resolve(__dirname, `../summaryReport/${file}`))
        await fs.unlink(path.resolve(__dirname, `../sizesReports/${file}`))
      }
      console.log('removed all results and errors')
    } catch(err) {
      console.error(err)
    }
  }
};
