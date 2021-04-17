import { MongoMemoryServer } from 'mongodb-memory-server';
import { createConnection } from '.';

let mongoServer: MongoMemoryServer;

describe('database implementation', () => {
  beforeAll(() => {
    mongoServer = new MongoMemoryServer();
  });

  afterAll(() => {
    mongoServer.stop();
  });

  test('should setup db conection successfully with correct url', async () => {
    const res = createConnection({
      url: await mongoServer.getUri(),
      dir: 'migrations',
      type: 'mongodb',
      tableName: 'migrations_changelog',
    });
    expect(res).toBeTruthy();
  });

  test('Invalid db type should throw error', async () => {
    const url = await mongoServer.getUri();
    expect(() =>
      createConnection({
        url,
        dir: 'migrations',
        type: 'invalidDb',
        tableName: 'migrations_changelog',
      }),
    ).toThrowErrorMatchingSnapshot();
  });
});
