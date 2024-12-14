import { prisma } from "../../database/prismaClient";
import { InvoiceBase } from "./InvoiceBase";
import { InvoiceTypes } from "./types";


class FixedCreate extends InvoiceBase {


    constructor({user_id,wallet_id,ds_wallet,category_id,description,ds_category,price,due_at}:InvoiceTypes){
        super()
        this.user_id =user_id;
        this.wallet_id= wallet_id;
        this.ds_wallet = ds_wallet;
        this.category_id= category_id;
        this.ds_category = ds_category;
        this.description = description;
        this.price = price;
        this.due_at = due_at



    }

    async execute(){
        try{

            const fixedCreate = await prisma.app_invoice.create({
                data: {
                    user_id: this.user_id,
                    wallet_id: this.wallet_id,
                    ds_wallet: this.ds_wallet,
                    category_id: this.category_id,
                    ds_category: this.ds_category,
                    description: this.description,
                    price: this.price,
                    due_at: this.due_at,
                    type: this.type,
                    pay: this.pay,
                    repeat_when: this.repeat_when,
                    period: this.period,
                    name: this.name,
                },
            });

        }catch(error){
            console.log(error)
        }finally{
            prisma.$disconnect()
        }
    }
}