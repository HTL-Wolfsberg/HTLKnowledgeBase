import { DateTime } from 'luxon';
import { TagModel } from "./tag-model";

export interface FileModel {
    id: string;
    name: string;
    size: number;
    type: string;
    tagList: TagModel[];
    path: string;
    created: string | Date;
    lastChanged: string | Date;
    authorId: string;
    authorName: string;

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
    created: Date;
    lastChanged: Date;
    authorId: string;
    authorName: string;

    constructor(file: FileModel) {
        this.id = file.id;
        this.name = file.name;
        this.size = file.size;
        this.type = file.type;
        this.tagList = file.tagList;
        this.path = file.path;
        this.created = typeof file.created === 'string' ? DateTime.fromISO(file.created).toJSDate() : file.created;
        this.lastChanged = typeof file.lastChanged === 'string' ? DateTime.fromISO(file.lastChanged).toJSDate() : file.lastChanged;
        this.authorId = file.authorId;
        this.authorName = file.authorName;
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
