export interface FileModel {
    id: number;
    name: string;
    size: number;
    type: string;
    tagNameList: string[];
    Path: string;
    createdDate: Date;
    modifiedDate: Date;
}