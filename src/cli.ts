import { Command } from 'commander';
import { CheckCommand } from './commands';
import { loadConfiguration } from './configuration';
import { error, log } from './log';

const program = new Command();
const config = loadConfiguration();

program
  .command('new')
  .description('Creates new migration template')
  .action(() => {
    log('New migration');
    // TODO
  });

program
  .command('status', { isDefault: true })
  .description('Verify migration status')
  .action(async () => {
    log(`config loaded ${JSON.stringify(config)}`);
    let task = new CheckCommand(config);
    if (await task.execute()) {
      log('Succeed!!!');
    } else {
      error('Failed to verify migration status');
    }
  });

program
  .command('up')
  .description('Doing migration forward')
  .action(() => {
    log('Up migration');
    // TODO
  });

program
  .command('down')
  .description('Doing migration backward')
  .action(() => {
    log('Down migration');
    // TODO
  });

program.parse(process.argv);
