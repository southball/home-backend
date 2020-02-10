import {Table, Column, Model, DataType} from 'sequelize-typescript';

@Table
export default class File extends Model<File> {
    /**
     * Relative path from filesFolder to dirname of file.
     */
    @Column(DataType.TEXT)
    folder: string;

    /**
     * Basename of file.
     */
    @Column(DataType.TEXT)
    filename: string;

    /**
     * A JSON array of tags.
     */
    @Column(DataType.TEXT)
    tags: string;
}
