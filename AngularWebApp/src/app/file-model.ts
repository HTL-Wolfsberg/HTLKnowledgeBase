import { TagModel } from "./tag-model";

export interface FileModel {
    id: number;
    name: string;
    size: number;
    type: string;
    tagList: TagModel[];
    Path: string;
    createdDate: Date;
    modifiedDate: Date;
}