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
    tags?: Tag[];
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