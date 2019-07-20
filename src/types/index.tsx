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

export interface FormProps {
    item: Item;
    tags: Tag[];
    sending: boolean;
    changed: boolean;
    onItemChange: (item: ItemDiff) => void;
    onCreateTag: (tagName: string) => void;
    onPublicLinkCopy: () => void;
}

export interface FiltersValue {
    text: string; 
    tags: Tag[];
}

export interface FiltersValueDiff {
    text?: string; 
    tags?: Tag[];
}

export interface FiltersProps {
    filters: FiltersValue;
    tags: Tag[];
    onFiltersChange: (filters: FiltersValueDiff) => void;
}

export interface ListProps {
    items: Item[];
    item: Item | null | undefined;
    loading: boolean;
    onDeleteItem: (item: Item) => void;
}

export interface ReadonlyNoteProps {
    item: Item;
}

export interface TextEditorProps {
    value: string;
    onChange: (value: string) => void;
}

export interface TextEditorState {
    value: EditorValue;
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

export interface SortProps {
    sort: SortValue;
    onSortChange: (sort: SortValueDiff) => void;
}

export interface AppProps extends RouteComponentProps {
    match: {
        params: {
            id: string
        }; 
        isExact: boolean; 
        path: string; 
        url: string;
    };
}

export interface AppState {
    item: Item | null | undefined;
    items: Item[];
    filters: FiltersValue;
    sort: SortValue;
    loadingList: boolean;
    formChanged: boolean;
    sendingForm: boolean;
    error: string;
    publicLinkCopied: boolean;
}

export interface Session {
    _id: string;
    userID: string; 
    active: boolean; 
    expireDate: string;
    loggedAs: string;
}
