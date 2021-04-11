import { IConfiguration } from '../configuration';
import { log } from '../log';
import { AbstractCommand } from './AbstractCommand';

export class DownCommand extends AbstractCommand {
  /**
   *
   */
  constructor(config: IConfiguration) {
    super(config);
  }

  public async run(): Promise<boolean> {
    log('Downgrade database...');
    if (this.client) {
      await this.client.connect();

      await this.client.close();
    }
    return true;
  }
}
