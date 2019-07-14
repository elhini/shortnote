import { ValueType } from "react-select/src/types";
import { EditorValue } from "react-rte";

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
    title?: string;
    text?: string;
    tags?: ValueType<Tag>;
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
}

export interface Filters {
    text: string; 
    tags: Tag[];
}

export interface FiltersDiff {
    text?: string; 
    tags?: ValueType<Tag>;
}

export interface FiltersProps {
    filters: Filters;
    tags: Tag[];
    onFiltersChange: (filters: FiltersDiff) => void;
}

export interface ListProps {
    items: Item[];
    item: Item;
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

export interface Sort {
    field: string; 
    direction: string;
}

export interface SortDiff {
    field?: string; 
    direction?: string;
}

export interface SortProps {
    sort: Sort;
    onSortChange: (sort: SortDiff) => void;
}
