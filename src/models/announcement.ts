import {Table, Column, Model, DataType} from 'sequelize-typescript';

@Table
export default class Announcement extends Model<Announcement> {
    /**
     * Relative path from filesFolder to dirname of file.
     */
    @Column(DataType.TEXT)
    title: string;

    /**
     * Basename of file.
     */
    @Column(DataType.TEXT)
    content: string;

    /**
     * A JSON array of tags.
     */
    @Column(DataType.INTEGER)
    priority: number;
}
