import { InvoiceBase } from "./InvoiceBase";
import { IInvoiceSearch, InvoiceTypes } from "./types";
import { prisma } from "../../database/prismaClient";

 export class FixedList extends InvoiceBase {
   

    constructor({user_id,wallet_id}:IInvoiceSearch){
        super()
        this.user_id = user_id
        this.wallet_id = wallet_id
    }
    

    private  mapData(data:any) {
        const newData = data.map((item:any) => {
            const obj:Record<string, unknown> = {};

            const date = new Date(item.due_at);
            //formata status
            let statusPay:boolean;
            if (item.pay === "paid") {
                statusPay = true;
            } else {
                statusPay = false;
            }
            obj.id = item.id;
            obj.due_at =
                date.getUTCDate() < 10
                    ? "Dia 0" + date.getUTCDate()
                    : "Dia " + date.getUTCDate();
            obj.description =
                item.type === "fixed_income"
                    ? "Receita / " + item.description
                    : "Despesa / " + item.description;
            obj.price =
                item.price.toLocaleString("pt-br", {
                    style: "currency",
                    currency: "BRL",
                }) + " /mês";
            obj.status = statusPay;
            obj.type = item.type;
            return obj;
        });

        return newData;
    }

    async execute(){

        try{

            const fixed = await prisma.app_invoice.findMany({
                where: {
                    user_id: this.user_id,
                    wallet_id: this.wallet_id,
                    type: { in: ["fixed_income", "fixed_expense"] },
                },
            });
            console.log(fixed)

            return this.mapData(fixed)

        }catch(error){
            // throw new Error("") => verificar o que fazer aqui;
            
            console.log(error)
        }finally{
            prisma.$disconnect()
        }
    }
 
 }