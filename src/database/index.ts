import { MongoClient } from 'mongodb';
import { IConfiguration } from '../configuration';
import { log } from '../log';

enum DbType {
  MONGO = 'mongodb',
  MYSQL = 'mysql',
}

type DbConnection = MongoClient | undefined;

const createConnection = async (
  config: IConfiguration,
): Promise<DbConnection> => {
  let client: DbConnection;
  try {
    switch (config.type) {
      case DbType.MONGO: {
        client = new MongoClient(config.url, {
          useUnifiedTopology: true,
        });
        log('Connection created!');
        break;
      }
    }
  } catch (error) {
    error('Failed to connect to database.');
  } finally {
    return client;
  }
};

export { DbConnection, createConnection };
