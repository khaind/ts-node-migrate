import { MigrationModel } from '.';
import { IConfiguration } from '../configuration';
import { createConnection, IDbConnection } from '../database';
import { error, info, log } from '../log';

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

  public static async getInstance(config: IConfiguration): Promise<Migrator> {
    if (!Migrator.instance) {
      Migrator.instance = new Migrator(config);
      Migrator.instance.dbConnection = await createConnection(config);
    }

    return Migrator.instance;
  }

  public async check(): Promise<boolean> {
    try {
      await this.dbConnection!.connect();
      const migrations = await this.dbConnection!.listMigrations();
      await this.dbConnection!.close();

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

  public async new(): Promise<boolean> {
    try {
      // TODO
    } catch (err) {
      error(`check(): ${JSON.stringify(err)}`);
    }
    return true;
  }

  public async up(): Promise<boolean> {
    try {
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
