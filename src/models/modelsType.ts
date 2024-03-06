export interface CategoryTypes {
    id?: number | undefined;
    user_id?: number | undefined;
    name?: string;
    description?: string;
    type?: string;
}

export interface WalletTypes {
    id?: number | undefined;
    user_id?: number | undefined;
    name?: string;
    description?: string;
    option_wallet?: number;
}

export interface UserTypes {
    id: number | undefined;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    photo?: string | undefined;
}

export interface DashTypes {
    user_id: number;
    wallet_id: number;
}

export interface InvoiceTypes {
    id: number;
    user_id?: number;
    wallet_id: number;
    category_id: number;
    invoice_of?: number;
    name?: string;
    description?: string;
    price?: number;
    due_at?: Date;
    type?: string;
    pay?: string;
    repeat_when?: string;
    period?: string;
    date_init?: string;
    date_end?: string;
    typeTransfer?: string;
}
