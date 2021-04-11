require('dotenv').config();

interface IConfiguration {
  url: string; // db connection string
  type: string; // db type: [mongodb, mysql]
  dir: string; // migrations directory
  tableName: string; // migration db table name
}

const loadConfiguration = (): IConfiguration => {
  let config = {
    url: process.env.TSNM_URL as string,
    type: (process.env.TSNM_DB_TYPE as string) || 'mongodb',
    dir: (process.env.TSNM_DIR as string) || 'migrations',
    tableName: (process.env.TSNM_TABLE_NAME as string) || 'tsnm_changelog',
  };
  return config;
};

export { IConfiguration, loadConfiguration };
