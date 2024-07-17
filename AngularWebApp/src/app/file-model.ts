import { TagModel } from "./tag-model";

export interface FileModel {
    id: string;
    name: string;
    size: number;
    type: string;
    tagList: TagModel[];
    Path: string;
    createdDate: Date;
    modifiedDate: Date;

    getFileNameWithoutExtension(): string;
    getFileExtension(): string;
}

export class FileModelImpl implements FileModel {
    id: string;
    name: string;
    size: number;
    type: string;
    tagList: TagModel[];
    Path: string;
    createdDate: Date;
    modifiedDate: Date;

    constructor(file: FileModel) {
        this.id = file.id;
        this.name = file.name;
        this.size = file.size;
        this.type = file.type;
        this.tagList = file.tagList;
        this.Path = file.Path;
        this.createdDate = file.createdDate;
        this.modifiedDate = file.modifiedDate;
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
