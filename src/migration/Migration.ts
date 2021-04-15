import { MongoClient } from 'mongodb';
// TODO move dependency to mongodb out

export class MigrationModel {
  timestamp: number = 0;
  name: string = '';
}

export class MigrationFile {
  timestamp: number = 0;
  name: string = '';
}

export interface MigrationInterface {
  up(client: MongoClient): Promise<any>;
  down(client: MongoClient): Promise<any>;
}
