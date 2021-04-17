import { IConfiguration } from '../configuration';
import { error, log } from '../log';
import { IDbConnection } from './IDbConnection';
import { MongoDbConnection } from './MongoDbConnection';

enum DbType {
  MONGO = 'mongodb',
  MYSQL = 'mysql',
}

// type DbConnection = MongoClient | undefined;

const createConnection = (config: IConfiguration): IDbConnection => {
  let dbConnection: IDbConnection;
  try {
    switch (config.type) {
      case DbType.MONGO: {
        dbConnection = new MongoDbConnection(config);
        break;
      }
      default:
        throw `Invalid db type: ${config.type}`;
    }
  } catch (err) {
    error(err);
    throw `Failed to create database connection.`;
  }
  return dbConnection;
};

export { DbType, IDbConnection, createConnection };
