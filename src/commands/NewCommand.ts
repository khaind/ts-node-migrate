import { IConfiguration } from '../configuration';
import { error, log } from '../log';
import { Migrator } from '../migration';
import { AbstractCommand } from './AbstractCommand';

export class NewCommand extends AbstractCommand {
  name: string;
  /**
   *
   */
  constructor(config: IConfiguration, name: string) {
    super(config);
    this.name = name;
  }

  public async run(): Promise<boolean> {
    try {
      log('Creating new migration template');
      const migrator = Migrator.getInstance(this.configuration);
      return await migrator.new(this.name);
    } catch (err) {
      error(err);
    }
    return false;
  }
}
