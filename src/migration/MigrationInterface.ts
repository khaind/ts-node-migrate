import { MongoClient } from 'mongodb';

// TODO move dependency to mongodb out
export interface MigrationInterface {
  up(client: MongoClient): Promise<any>;
  down(client: MongoClient): Promise<any>;
}
