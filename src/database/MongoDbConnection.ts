import { MongoClient } from 'mongodb';
import { IConfiguration } from '../configuration';
import { error, log } from '../log';
import { MigrationModel } from '../migration';
import { IDbConnection } from './IDbConnection';

export class MongoDbConnection implements IDbConnection {
  client: MongoClient;
  configuration: IConfiguration;
  /**
   *
   */
  constructor(config: IConfiguration) {
    this.configuration = config;
    this.client = new MongoClient(config.url, {
      useUnifiedTopology: true,
    });
    log('Connection set up!');
  }

  public async connect(): Promise<boolean> {
    try {
      log('Connecting to db...');
      await this.client.connect();
      return true;
    } catch (err) {
      error(`connect error: ${err}`);
      return false;
    }
  }

  public async close(): Promise<boolean> {
    try {
      log('Closing connection to db...');
      await this.client.close();
      return true;
    } catch (err) {
      error(`connection close error: ${err}`);
      return false;
    }
  }

  public async listMigrations(): Promise<MigrationModel[]> {
    const migrationCollection = this.client
      .db()
      .collection(this.configuration.tableName);

    return migrationCollection.find().sort({ timestamp: 1 }).toArray();
  }

  public async addMigration(migration: MigrationModel): Promise<void> {
    const migrationCollection = this.client
      .db()
      .collection(this.configuration.tableName);
    await migrationCollection.insertOne(migration);
  }

  public async removeMigration(timestamp: number): Promise<void> {
    const migrationCollection = this.client
      .db()
      .collection(this.configuration.tableName);
    await migrationCollection.deleteOne({ timestamp });
  }

  public async getLastMigration(): Promise<MigrationModel> {
    const migrationCollection = this.client
      .db()
      .collection(this.configuration.tableName);
    const lastMigration = await migrationCollection
      .find()
      .sort({ timestamp: -1 })
      .limit(1)
      .next();
    return lastMigration;
  }
}
