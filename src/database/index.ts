import { IConfiguration } from '../configuration';
import { log } from '../log';

interface IDBClient {
  // TODO
}

const createConnection = async (config: IConfiguration): Promise<IDBClient> => {
  log(`connection created from config ${config}`);
  // TODO
  return {};
};

export { IDBClient, createConnection };
