import { IConfiguration } from '../configuration';
import { log } from '../log';
import { AbstractCommand } from './AbstractCommand';

export class CheckCommand extends AbstractCommand {
  /**
   *
   */
  constructor(config: IConfiguration) {
    super(config);
  }

  public async execute(): Promise<boolean> {
    log('Checking status ...');
    return true;
  }
}
