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
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    photo?: string | undefined;
}
