import { MongoMemoryServer } from 'mongodb-memory-server';
import { createConnection, IDbConnection } from '.';
import { MigrationModel } from '../migration';

let mongoServer: MongoMemoryServer;
let dbConnection: IDbConnection;

describe('mongodb driver', () => {
  beforeAll(async () => {
    mongoServer = new MongoMemoryServer();
    dbConnection = createConnection({
      url: await mongoServer.getUri(),
      dir: 'migrations',
      type: 'mongodb',
      tableName: 'migrations_changelog',
    });

    await dbConnection.connect();
    await dbConnection!.client!.db().createCollection('migrations_changelog');
  });

  afterAll(async () => {
    await dbConnection!.client!.db().dropCollection('migrations_changelog');
    await dbConnection.close();
    mongoServer.stop();
  });

  afterEach(async () => {
    await dbConnection!
      .client!.db()
      .collection('migrations_changelog')
      .deleteMany({});
  });

  test('Should connect to db and close successfully with correct url', async () => {
    const connection = createConnection({
      url: await mongoServer.getUri(),
      dir: 'migrations',
      type: 'mongodb',
      tableName: 'migrations_changelog',
    });

    const res1 = await connection.connect();
    expect(res1).toBeTruthy();
    const res2 = await connection.close();
    expect(res2).toBeTruthy();
  });

  test('Should NOT connect to db with incorrect url', async () => {
    const connection = createConnection({
      url: 'anIncorrectUrl',
      dir: 'migrations',
      type: 'mongodb',
      tableName: 'migrations_changelog',
    });

    const res1 = await connection.connect();
    expect(res1).toBeFalsy();
  });

  test('List migration should return empty array when no migration existed', async () => {
    let migrations = await dbConnection.listMigrations();
    expect(migrations).toHaveLength(0);
  });

  test('List migration should return array with migration added', async () => {
    const migration: MigrationModel = {
      timestamp: new Date().getTime(),
      name: 'TestMigration',
    };
    await dbConnection!
      .client!.db()
      .collection('migrations_changelog')
      .insertOne(migration);

    let migrations = await dbConnection.listMigrations();
    expect(migrations).toHaveLength(1);
    expect(migrations[0].name).toEqual(migration.name);
    expect(migrations[0].timestamp).toEqual(migration.timestamp);
  });

  test('Add new migration', async () => {
    const migration: MigrationModel = {
      timestamp: new Date().getTime(),
      name: 'TestMigration',
    };
    await dbConnection.addMigration(migration);

    let migrations = await dbConnection.listMigrations();
    expect(migrations).toHaveLength(1);
    expect(migrations[0].name).toEqual(migration.name);
    expect(migrations[0].timestamp).toEqual(migration.timestamp);
  });

  test('Remove a migration', async () => {
    const migration: MigrationModel = {
      timestamp: new Date().getTime(),
      name: 'TestMigration',
    };
    await dbConnection.addMigration(migration);

    let migrations = await dbConnection.listMigrations();
    expect(migrations).toHaveLength(1);

    await dbConnection.removeMigration(migration.timestamp);

    migrations = await dbConnection.listMigrations();
    expect(migrations).toHaveLength(0);
  });

  test('Get last migration', async () => {
    const migrations: MigrationModel[] = [
      {
        timestamp: 1618328287700,
        name: 'FirstMigration',
      },
      {
        timestamp: 1618328287800,
        name: 'SecondMigration',
      },
    ];

    await dbConnection!
      .client!.db()
      .collection('migrations_changelog')
      .insertMany(migrations);

    const migration = await dbConnection.getLastMigration();
    expect(migration).toBeDefined();
    expect(migration.name).toBe('SecondMigration');
    expect(migration.timestamp).toBe(1618328287800);
  });
});
