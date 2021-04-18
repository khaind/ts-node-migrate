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
    this.dbConnection = createConnection(config);
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
      await this.dbConnection!.connect();
      const dbMigrations = await this.dbConnection!.listMigrations();
      await this.dbConnection!.close();

      this.createFolderIfNotExists(this.configuration.dir);
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
        const [name, timestamp] = fileName.split('_');

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
    return /^[a-zA-Z]+_[0-9]{13}.ts$/gm.test(file);
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
      const timestamp = new Date().getTime();
      const fileName = this.generateFileName(timestamp, name);
      const template = this.getMigrationTemplate(fileName);

      fs.writeFileSync(`${dir}/${fileName}.ts`, template);

      log(`${fileName}.ts written!`);

      return true;
    } catch (err) {
      error(err);
    }
    return false;
  }

  private generateFileName(timestamp: number, name?: string) {
    return `${name || 'Migration'}_${timestamp}`;
  }

  private getMigrationTemplate(className: string) {
    // TODO template defined by type
    return `import { MongoClient } from 'mongodb';
import { MigrationInterface } from 'ts-node-migrate';

export class ${className} implements MigrationInterface {
  public async up(client: MongoClient): Promise<void> {
    // Implement your upgrade logic HERE
  }

  public async down(client: MongoClient): Promise<void> {
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
      await this.dbConnection!.connect();

      const dbMigrations = await this.dbConnection!.listMigrations();
      const fileMigrations = this.listFileMigrations();

      let isUpgraded = true;
      for (let m of fileMigrations) {
        isUpgraded = !!dbMigrations.find(
          (dbM) => dbM.timestamp === m.timestamp && dbM.name === m.name,
        );

        if (!isUpgraded) {
          // Run upgrade
          let migrationObj = await this.createMigrationObject(m);
          await migrationObj.up(this.dbConnection!.client);

          await Migrator.instance.dbConnection!.addMigration({
            timestamp: m.timestamp,
            name: m.name,
          });

          info(`${m.name} upgraded!`);
        }
      }

      if (isUpgraded) {
        info('No new migration found!');
      }

      await this.dbConnection!.close();
      return true;
    } catch (err) {
      error(`up(): ${JSON.stringify(err)}`);
      await this.dbConnection!.close();
    }
    return false;
  }

  private async createMigrationObject(migrationFile: MigrationFile) {
    const fileName = this.generateFileName(
      migrationFile.timestamp,
      migrationFile.name,
    );
    const absolutePath = path.resolve(
      `${this.configuration.dir}/${fileName}.ts`,
    );

    if (!fs.existsSync(absolutePath)) {
      throw `Could not resolve migration file ${absolutePath}`;
    }

    let migrationClass = await import(absolutePath);

    if (!this.isValidMigrationClass(migrationClass, fileName)) {
      throw 'Invalid migration class Name';
    }

    let migrationObj = new migrationClass[fileName]();
    return migrationObj;
  }

  private isValidMigrationClass(migrationClass: any, fileName: string) {
    return !!Object.keys(migrationClass).find((k) => k === fileName);
  }

  public async down(): Promise<boolean> {
    try {
      await this.dbConnection!.connect();

      const migration = await this.dbConnection!.getLastMigration();

      // Run downgrade
      let migrationObj = await this.createMigrationObject({
        name: migration.name,
        timestamp: migration.timestamp,
      });
      await migrationObj.down(this.dbConnection!.client);

      await Migrator.instance.dbConnection!.removeMigration(
        migration.timestamp,
      );

      info(`${migration.name} downgraded!`);

      await this.dbConnection!.close();
      return true;
    } catch (err) {
      error(`down(): ${JSON.stringify(err)}`);
      await this.dbConnection!.close();
    }
    return false;
  }
}
