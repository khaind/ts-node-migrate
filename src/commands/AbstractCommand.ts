import { IConfiguration } from '../configuration';

export abstract class AbstractCommand {
  configuration: IConfiguration;
  /**
   *
   */
  constructor(config: IConfiguration) {
    this.configuration = config;
  }

  abstract run(): Promise<boolean>;
}
