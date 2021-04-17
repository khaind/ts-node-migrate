import { defaultConfig, IConfiguration, loadConfiguration } from '.';

describe('Configuration loader tester', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules(); // Most important - it clears the cache
    process.env = { ...OLD_ENV }; // Make a copy
  });

  afterAll(() => {
    process.env = OLD_ENV; // Restore old environment
  });

  test('Should load default value', () => {
    process.env.TSNM_URL = undefined;
    process.env.TSNM_DIR = undefined;
    process.env.TSNM_DB_TYPE = undefined;
    process.env.TSNM_TABLE_NAME = undefined;

    const config = loadConfiguration();
    expect(config).toEqual(defaultConfig);
  });

  test('Should load correct environment values', () => {
    const config: IConfiguration = {
      url: 'url',
      dir: 'dir',
      type: 'type',
      tableName: 'tableName',
    };
    process.env.TSNM_URL = config.url;
    process.env.TSNM_DIR = config.dir;
    process.env.TSNM_DB_TYPE = config.type;
    process.env.TSNM_TABLE_NAME = config.tableName;

    expect(loadConfiguration()).toEqual(config);
  });
});
