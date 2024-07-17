import { TagModel } from "./tag-model";

export interface FileModel {
    id: string;
    name: string;
    size: number;
    type: string;
    tagList: TagModel[];
    path: string;
    createdDate: Date;
    modifiedDate: Date;
    userId: string;

    getFileNameWithoutExtension(): string;
    getFileExtension(): string;
}

export class FileModelImpl implements FileModel {
    id: string;
    name: string;
    size: number;
    type: string;
    tagList: TagModel[];
    path: string;
    createdDate: Date;
    modifiedDate: Date;
    userId: string;

    constructor(file: FileModel) {
        this.id = file.id;
        this.name = file.name;
        this.size = file.size;
        this.type = file.type;
        this.tagList = file.tagList;
        this.path = file.path;
        this.createdDate = file.createdDate;
        this.modifiedDate = file.modifiedDate;
        this.userId = file.userId;
    }

    getFileNameWithoutExtension(): string {
        const lastDotIndex = this.name.lastIndexOf('.');
        return lastDotIndex !== -1 ? this.name.substring(0, lastDotIndex) : this.name;
    }

    getFileExtension(): string {
        const lastDotIndex = this.name.lastIndexOf('.');
        return lastDotIndex !== -1 ? this.name.substring(lastDotIndex + 1) : '';
    }
}
