import { MigrationModel } from '../migration';

export interface IDbConnection {
  connect(): Promise<boolean>;
  close(): Promise<boolean>;
  listMigrations(): Promise<MigrationModel[]>;
  addMigration(migration: MigrationModel): Promise<void>;
  removeLastMigration(): Promise<void>;
}
