import { MigrationModel } from '.';
import { IConfiguration } from '../configuration';
import { createConnection, IDbConnection } from '../database';
import { debug, error, info, log, warn } from '../log';
import fs from 'fs';
import { MigrationFile } from './Migration';
import path from 'path';

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
      const dbMigrations = await this.dbConnection!.listMigrations();
      await this.dbConnection!.close();

      const fileMigrations = this.listFileMigrations();

      this.printMigrationStatus(fileMigrations, dbMigrations);
    } catch (err) {
      error(`check(): ${JSON.stringify(err)}`);
    }
    return true;
  }

  private listFileMigrations(): MigrationFile[] {
    let files: MigrationFile[] = [];
    fs.readdirSync(this.configuration.dir).forEach((file) => {
      if (this.isValidMigrationFile(file)) {
        const fileName = path.basename(file, path.extname(file));
        const [timestamp, name] = fileName.split('_');
        files.push({
          name,
          timestamp: parseInt(timestamp),
        });
      } else {
        warn(
          `Invalid migration file name ${file}. A typical correct is 1618328287798_AValidFileName.ts`,
        );
      }
    });
    return files;
  }

  private isValidMigrationFile(file: string): boolean {
    return /^[0-9]{13}_[a-zA-Z]+.ts$/gm.test(file);
  }

  private printMigrationStatus(
    fileMigrations: MigrationFile[],
    dbMigrations: MigrationModel[],
  ) {
    info('\nMigration list.');
    info('-------------------------------------------------------------');
    info(`#\tstatus\t\ttimestamp\t\tname`);
    fileMigrations.map((m, index) => {
      const isUpgraded = dbMigrations.find(
        (dbM) => dbM.timestamp === m.timestamp && dbM.name === m.name,
      );
      log(
        `${index + 1}\t${isUpgraded ? 'Up' : 'Pending'}\t\t${m.timestamp}\t\t${
          m.name
        }`,
      );
    });
    info('-------------------------------------------------------------');
  }

  public async new(name: string): Promise<boolean> {
    try {
      this.createFolderIfNotExists(this.configuration.dir);
      if (!/^[a-zA-Z]+$/gm.test(name)) {
        error('Invalid file name which should contain letter only.');
        return false;
      }
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
      await this.dbConnection!.connect();

      const dbMigrations = await this.dbConnection!.listMigrations();
      const fileMigrations = this.listFileMigrations();

      for (let m of fileMigrations) {
        const isUpgraded = !!dbMigrations.find(
          (dbM) => dbM.timestamp === m.timestamp && dbM.name === m.name,
        );

        if (!isUpgraded) {
          // TODO run upgrade
          await Migrator.instance.dbConnection!.addMigration({
            timestamp: m.timestamp,
            name: m.name,
          });
          info(`${m.name} upgraded!`);
        }
      }

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
