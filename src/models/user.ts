import {Table, Column, Model, DataType} from 'sequelize-typescript';
import * as uuidv4 from 'uuid/v4';

@Table
export default class User extends Model<User> {
    @Column(DataType.TEXT)
    email: string;

    @Column(DataType.TEXT)
    displayName: string;

    @Column(DataType.TEXT)
    permissionLevel: string;

    @Column(DataType.TEXT)
    lastSessionId: string;

    @Column(DataType.DATE)
    lastSessionExpire: Date;

    async updateSession(autoSave: boolean = true): Promise<void> {
        const now = new Date();
        if (!this.lastSessionId || now > this.lastSessionExpire) {
            // Generate new session ID
            this.lastSessionId = uuidv4();
            // Set expire time to 24 hours later
            this.lastSessionExpire = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        }

        if (autoSave)
            await this.save();
    }
}
