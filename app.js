const compareSize = require("./services/size-compare.service");
const cleanUp = require("./services/clean-up.service");
const getSummary = require("./services/summary.service");
const sizeReport = require("./services/size-report.service");
const cliSelect = require("cli-select");
const chalk = require("chalk");

(async function main() {
  try {
    const { value } = await cliSelect({
      values: [
        "Compare results",
        "Get summary",
        "Delete results",
        "Exit",
        "Detailed size report",
      ],
      valueRenderer: (value, selected) => {
        return value;
      },
    });
    switch (value) {
      case "Compare results":
        return compareSize();
      case "Get summary":
        return getSummary();
      case "Detailed size report":
        return sizeReport();
      case "Delete results":
        return cleanUp();
      case "Exit":
        return process.exit(1);
    }
  } catch (error) {
    chalk.red(error);
  }
})();
