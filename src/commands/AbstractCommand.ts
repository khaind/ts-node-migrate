import { IConfiguration } from '../configuration';
import { IDBClient, createConnection } from '../database';

export abstract class AbstractCommand {
  client: IDBClient;
  /**
   *
   */
  constructor(config: IConfiguration) {
    this.client = createConnection(config);
  }

  abstract execute(): Promise<boolean>;
}
