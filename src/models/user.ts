import {Table, Column, Model, DataType} from 'sequelize-typescript';

@Table
export default class User extends Model<User> {
    @Column(DataType.TEXT)
    email: string;

    @Column(DataType.TEXT)
    displayName: string;

    @Column(DataType.TEXT)
    permissionLevel: string;
}

