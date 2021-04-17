import { Command } from 'commander';
import { CheckCommand, DownCommand, NewCommand, UpCommand } from './commands';
import { loadConfiguration } from './configuration';
import { error, log } from './log';

const config = loadConfiguration();
// TODO validate config
log(`config loaded ${JSON.stringify(config)}`);

const program = new Command();

program
  .command('new [name]')
  .description('Creates new named(optional) migration template')
  .action(async (name: string) => {
    console.log(JSON.stringify(name));
    let task = new NewCommand(config, name);
    if (await task.run()) {
      log('Succeed!!!');
    } else {
      error('Failed to create new migration file.');
    }
  });

program
  .command('status', { isDefault: true })
  .description('Verify migration status')
  .action(async () => {
    let task = new CheckCommand(config);
    if (await task.run()) {
      log('Succeed!!!');
    } else {
      error('Failed to verify migration status.');
    }
  });

program
  .command('up')
  .description('Doing migration forward')
  .action(async () => {
    let task = new UpCommand(config);
    if (await task.run()) {
      log('Succeed!!!');
    } else {
      error('Failed to upgrade database.');
    }
  });

program
  .command('down')
  .description('Doing migration backward')
  .action(async () => {
    let task = new DownCommand(config);
    if (await task.run()) {
      log('Succeed!!!');
    } else {
      error('Failed to downgrade database.');
    }
  });

export { program };
