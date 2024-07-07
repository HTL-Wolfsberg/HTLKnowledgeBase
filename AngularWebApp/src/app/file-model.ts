export interface FileModel {
    id: number;
    name: string;
    size: number;
    fileType: string;
    tags: string[];
    createdDate: Date;
    modifiedDate: Date;
}