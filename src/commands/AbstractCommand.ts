import { IConfiguration } from '../configuration';
import { DbConnection, createConnection } from '../database';

export abstract class AbstractCommand {
  client: DbConnection;
  configuration: IConfiguration;
  /**
   *
   */
  constructor(config: IConfiguration) {
    this.configuration = config;
  }

  async init() {
    this.client = await createConnection(this.configuration);
  }

  abstract run(): Promise<boolean>;
}
