import { IConfiguration } from '../configuration';
import { log } from '../log';
import { AbstractCommand } from './AbstractCommand';

export class NewCommand extends AbstractCommand {
  /**
   *
   */
  constructor(config: IConfiguration) {
    super(config);
  }

  public async run(): Promise<boolean> {
    log('Creating new migration template');
    if (this.client) {
      await this.client.connect();

      await this.client.close();
    }
    return true;
  }
}
