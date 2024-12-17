export  class  InvoiceBase{
    id: number= 0;
    user_id : number = 0;
    wallet_id: number= 0;
    ds_wallet: string = "";
    category_id: number = 0;
    ds_category: string = "";
    invoice_of: number = 0;
    name: string = "";
    description?: string = "";
    price?: number= 0;
    due_at: Date =  new Date();
    type?: string = "";
    pay: string = "";
    repeat_when: string = "";
    period: string = "";
    date_init: string = "";
    date_end: string = "";
    typeTransfer: string = "";
}