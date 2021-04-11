import { IConfiguration } from '../configuration';
import { error, log } from '../log';
import { Migrator } from '../migration';
import { AbstractCommand } from './AbstractCommand';

export class NewCommand extends AbstractCommand {
  /**
   *
   */
  constructor(config: IConfiguration) {
    super(config);
  }

  public async run(): Promise<boolean> {
    try {
      log('Creating new migration template');
      const migrator = await Migrator.getInstance(this.configuration);
      return await migrator.new();
    } catch (err) {
      error(err);
    }
    return false;
  }
}
