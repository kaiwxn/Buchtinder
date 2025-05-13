export type BookJsonObject = {
    volume_id: string;
    title: string;
    authors: string[];
    thumbnail?: string;
    isbn?: string;
    info_link: string;
    categories?: string[];
    language?: string;
};

export type BookSearchModalProps = {
    onClose: () => void;
};
