import { IConfiguration } from '../configuration';
import { error, log } from '../log';
import { Migrator } from '../migration';
import { AbstractCommand } from './AbstractCommand';

export class UpCommand extends AbstractCommand {
  /**
   *
   */
  constructor(config: IConfiguration) {
    super(config);
  }

  public async run(): Promise<boolean> {
    try {
      log('Upgrade database ...');
      const migrator = await Migrator.getInstance(this.configuration);
      return await migrator.up();
    } catch (err) {
      error(err);
    }
    return false;
  }
}
