import { IConfiguration } from '../configuration';
import { log } from '../log';
import { IDbConnection } from './IDbConnection';
import { MongoDbConnection } from './MongoDbConnection';

enum DbType {
  MONGO = 'mongodb',
  MYSQL = 'mysql',
}

// type DbConnection = MongoClient | undefined;

const createConnection = async (
  config: IConfiguration,
): Promise<IDbConnection> => {
  let dbConnection: IDbConnection;
  try {
    switch (config.type) {
      case DbType.MONGO: {
        dbConnection = new MongoDbConnection(config);
        break;
      }
      default:
        throw new Error(`Invalid db type: ${config.type}`);
    }
  } catch (error) {
    throw new Error(`Failed to connect to database.`);
  }
  return dbConnection;
};

export { DbType, IDbConnection, createConnection };
