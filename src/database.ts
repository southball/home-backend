import { Sequelize } from 'sequelize-typescript';
import User from './models/user';
import File from './models/file';
import Announcement from './models/announcement';
import {ServerConfig} from "./server";

export default class Database {
    private static sequelize: Sequelize;

    // TODO change to support other types of database
    // For development purposes, only supported database type is Sqlite3.
    public static async init(config: ServerConfig): Promise<void> {
        if (!Database.sequelize) {
            const sequelize = new Sequelize({
                dialect: 'postgres',
                host: config.postgresHost,
                database: config.postgresDB,
                username: config.postgresUser,
                password: config.postgresPassword,
            });

            sequelize.addModels([
                File,
                User,
                Announcement,
            ]);

            // await sequelize.sync({ force: true });
            await sequelize.sync();

            Database.sequelize = sequelize;
        }
    }

    // TODO change to support other types of database
    // For development purposes, only supported database type is Sqlite3.
    public static getSequelize(path: string): Sequelize {
        return Database.sequelize;
    }
}
