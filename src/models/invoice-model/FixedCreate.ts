import { prisma } from "../../database/prismaClient";
import { InvoiceBase } from "./InvoiceBase";
import { InvoiceTypes } from "./types";


export class FixedCreate extends InvoiceBase{

    constructor({user_id, category_id,wallet_id,description,due_at, price}:InvoiceTypes){
        super()
        this.user_id = user_id;
        this.category_id = category_id;
        this.wallet_id = wallet_id;
        this.description = description;
        this.price = price;
    }



    async execute(){
        try{
         //CONTINUAR DAQUI    
            const create;
        }catch(error){

        }finally{
            prisma.$disconnect()
        }
    }


}