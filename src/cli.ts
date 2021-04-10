import { Command } from 'commander';

const program = new Command();

program
  .command('init')
  .description('Creates the migrations directory and configuration file')
  .action(() => {
    console.log('Initialized');
    // TODO init();
  });

program
  .command('new')
  .description('Creates new migration template')
  .action(() => {
    console.log('New migration');
    // TODO
  });

program
  .command('status', { isDefault: true })
  .description('Verify migration status')
  .action(() => {
    console.log('Status');
    // TODO
  });

program
  .command('up')
  .description('Doing migration forward')
  .action(() => {
    console.log('Up migration');
    // TODO
  });

program
  .command('down')
  .description('Doing migration backward')
  .action(() => {
    console.log('Down migration');
    // TODO
  });

program.parse(process.argv);
