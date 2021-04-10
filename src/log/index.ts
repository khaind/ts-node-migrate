const chalk = require('chalk');

const log = (msg: string) => {
  console.log(chalk.blue(msg));
};

const warn = (msg: string) => {
  console.warn(chalk.yellow(msg));
};

const error = (msg: string) => {
  console.error(chalk.red(msg));
};

export { log, warn, error };
