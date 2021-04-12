import { IConfiguration } from '../configuration';
import { error, log } from '../log';
import { Migrator } from '../migration';
import { AbstractCommand } from './AbstractCommand';

export class DownCommand extends AbstractCommand {
  /**
   *
   */
  constructor(config: IConfiguration) {
    super(config);
  }

  public async run(): Promise<boolean> {
    try {
      log('Downgrade database...');
      const migrator = Migrator.getInstance(this.configuration);
      return await migrator.down();
    } catch (err) {
      error(err);
    }
    return false;
  }
}
