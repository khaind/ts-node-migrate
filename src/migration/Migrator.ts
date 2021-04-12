import { MigrationModel } from '.';
import { IConfiguration } from '../configuration';
import { createConnection, IDbConnection } from '../database';
import { debug, error, info, log } from '../log';
import fs from 'fs';

/**
 * Migrator is a controller object and implementing as a singleton
 */
export class Migrator {
  private static instance: Migrator;
  private configuration: IConfiguration;
  private dbConnection: IDbConnection | undefined;

  private constructor(config: IConfiguration) {
    this.configuration = config;
  }

  public static getInstance(config: IConfiguration): Migrator {
    if (!Migrator.instance) {
      Migrator.instance = new Migrator(config);
    }

    return Migrator.instance;
  }

  /**
   * Verify migration status by getting a list of migration files and currently upgraded migrations from db
   */
  public async check(): Promise<boolean> {
    try {
      this.dbConnection = await createConnection(this.configuration);
      await this.dbConnection!.connect();
      const migrations = await this.dbConnection!.listMigrations();
      await this.dbConnection!.close();

      fs.readdirSync(this.configuration.dir).forEach((file) => {
        console.log(file);
      });

      info('\nMigration list.');
      info('----------------------------------------------');
      info(`#\tstatus\t\ttimestamp\t\tname`);
      migrations.map((m, index) => {
        info(`${index + 1}\tPENDING\t\t${m.timestamp}\t\t${m.name}`);
      });
      info('----------------------------------------------');
    } catch (err) {
      error(`check(): ${JSON.stringify(err)}`);
    }
    return true;
  }

  public async new(name: string): Promise<boolean> {
    try {
      this.createFolderIfNotExists(this.configuration.dir);
      return this.createNewMigrationFiles(this.configuration.dir, name);
    } catch (err) {
      error(`check(): ${JSON.stringify(err)}`);
    }
    return false;
  }

  private createNewMigrationFiles(dir: string, name?: string) {
    try {
      const fileName = `${new Date().getTime()}_${name || 'Migration'}`;
      const template = this.getMigrationTemplate(fileName);
      fs.writeFileSync(`${dir}/${fileName}.ts`, template);
      log(`${fileName}.ts written!`);
      return true;
    } catch (err) {
      error(err);
    }
    return false;
  }

  private getMigrationTemplate(className: string) {
    return `import { Db } from 'mongodb;'
import { MigrationInterface } from 'ts-mongo-migrate';

  export class ${className} implements MigrationInterface {
    public async up(db: Db): Promise<void> {
      // Implement your upgrade logic HERE
    }

    public async down(db: Db): Promise<void> {
      // Implement your downgrade logic HERE
    }
  }
    `;
  }

  private createFolderIfNotExists(folderName: string) {
    try {
      if (!fs.existsSync(folderName)) {
        debug(`Folder not existed: ${folderName}. Creating new folder...`);
        fs.mkdirSync(folderName);
      }
    } catch (err) {
      error(err);
    }
  }

  public async up(): Promise<boolean> {
    try {
      this.dbConnection = await createConnection(this.configuration);
      // TODO run upgrade
      await this.dbConnection!.connect();

      // const migrations = await this.dbConnection!.addMigration({
      //   timestamp: new Date().getTime(),
      //   name: 'testMIgation',
      // });

      await this.dbConnection!.close();
    } catch (err) {
      error(`check(): ${JSON.stringify(err)}`);
    }
    return true;
  }

  public async down(): Promise<boolean> {
    try {
      this.dbConnection = await createConnection(this.configuration);
      // TODO run downgrade
      await this.dbConnection!.connect();

      const migrations = await this.dbConnection!.removeLastMigration();

      await this.dbConnection!.close();
    } catch (err) {
      error(`check(): ${JSON.stringify(err)}`);
    }
    return true;
  }
}
