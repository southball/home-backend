import { Sequelize } from 'sequelize-typescript';
import User from './models/user';
import File from "./models/file";

export default class Database {
    private static sequelize: Sequelize;

    // TODO change to support other types of database
    // For development purposes, only supported database type is Sqlite3.
    public static async init(path: string): Promise<void> {
        if (!Database.sequelize) {
            const sequelize = new Sequelize({
                database: 'home',
                dialect: 'sqlite',
                username: 'root',
                password: '',
                storage: path,
            });

            sequelize.addModels([
                File,
                User,
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
