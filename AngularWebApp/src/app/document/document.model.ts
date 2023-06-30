import { Tag } from "./Tag";

export interface Document {
    guid: string;
    path: string;
    tags: Tag[];
}
