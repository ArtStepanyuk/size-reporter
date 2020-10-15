
const args = process.argv.slice(2);
const decimalsToRound = parseInt(args[0]) || 20

module.exports =  {
  decimalsToRound
}