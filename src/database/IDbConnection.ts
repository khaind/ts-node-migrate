import { MigrationModel } from '../migration';
import { MongoClient } from 'mongodb';

export interface IDbConnection {
  client: MongoClient | undefined;
  connect(): Promise<boolean>;
  close(): Promise<boolean>;
  listMigrations(): Promise<MigrationModel[]>;
  addMigration(migration: MigrationModel): Promise<void>;
  removeMigration(timestamp: number): Promise<void>;
  getLastMigration(): Promise<MigrationModel>;
}
