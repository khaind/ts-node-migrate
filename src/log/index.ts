const chalk = require('chalk');

const log = (msg: any) => {
  if (typeof msg !== 'string') {
    msg = `${JSON.stringify(msg)}`;
  }
  console.log(chalk.blue(msg));
};

const info = (msg: string) => {
  if (typeof msg !== 'string') {
    msg = `${JSON.stringify(msg)}`;
  }
  console.log(chalk.green(msg));
};

const warn = (msg: string) => {
  if (typeof msg !== 'string') {
    msg = `${JSON.stringify(msg)}`;
  }
  console.warn(chalk.yellow(msg));
};

const error = (msg: string) => {
  if (typeof msg !== 'string') {
    msg = `${JSON.stringify(msg)}`;
  }
  console.error(chalk.red(msg));
};

const debug = (msg: string) => {
  if (typeof msg !== 'string') {
    msg = `${JSON.stringify(msg)}`;
  }
  console.debug(chalk.black(msg));
};

export { log, warn, error, info, debug };
