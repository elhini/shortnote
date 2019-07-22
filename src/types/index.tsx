import { EditorValue } from "react-rte";
import { RouteComponentProps } from "react-router-dom";

export interface Item {
    _id: string;
    title: string;
    text: string;
    tags: Tag[];
    dateOfCreate: Date;
    dateOfUpdate: Date;
    publicAccess: boolean;
}

export interface ItemDiff {
    _id?: string;
    title?: string;
    text?: string;
    tags?: Tag[];
    dateOfCreate?: Date;
    dateOfUpdate?: Date;
    publicAccess?: boolean;
}

export interface Tag {
    value: number;
    label: string;
}

export interface FiltersValue {
    text: string; 
    tags: Tag[];
}

export interface FiltersValueDiff {
    text?: string; 
    tags?: Tag[];
}

export type SortField = 'dateOfCreate' | 'dateOfUpdate';

export type SortDirection = 'asc' | 'desc';

export interface SortValue {
    field: SortField; 
    direction: SortDirection;
}

export interface SortValueDiff {
    field?: SortField; 
    direction?: SortDirection;
}

export interface Session {
    _id: string;
    userID: string; 
    active: boolean; 
    expireDate: string;
    loggedAs: string;
}

export interface User {
    _id: string;
    login: string;
    password: string;
    registrationDate: string;
    blocked: boolean;
}
