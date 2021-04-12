import { IConfiguration } from '../configuration';
import { error, log } from '../log';
import { Migrator } from '../migration';
import { AbstractCommand } from './AbstractCommand';

export class CheckCommand extends AbstractCommand {
  /**
   *
   */
  constructor(config: IConfiguration) {
    super(config);
  }

  public async run(): Promise<boolean> {
    try {
      log('Checking status ...');
      const migrator = Migrator.getInstance(this.configuration);
      return await migrator.check();
    } catch (err) {
      error(err);
    }
    return false;
  }
}
