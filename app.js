const compareSize = require('./services/size-compare.service')
const cliSelect = require('cli-select');
const chalk = require('chalk');

(async function main() {
  try {
    const {value} = await cliSelect({
      values: ['Compare results', 'Exit', 'Delete results'],
      valueRenderer: (value, selected) => {
          return value;
      },
    })
    switch (value) {
      case  'Exit': return process.exit(1)
      case  'Delete results': return process.exit(1)
      case 'Compare results': return compareSize()
    }
  } catch (error) {
    chalk.red(error)
  }
})()
