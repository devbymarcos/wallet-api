import { prisma } from "../../database/prismaClient";
import { InvoiceBase } from "./InvoiceBase";
import { InvoiceTypes } from "./types";

export class FixedCreate extends InvoiceBase {
    constructor({
        user_id,
        category_id,
        wallet_id,
        description,
        due_at,
        price,
        type,
        active,
    }: InvoiceTypes) {
        super();
        this.user_id = user_id;
        this.category_id = category_id;
        this.wallet_id = wallet_id;
        this.description = description;
        this.price = price;
        this.type = type;
        this.due_at = due_at;
        this.active = active;
    }

    async execute() {
        try {
            const create = await prisma.app_fixed.create({
                data: {
                    category_id: this.category_id,
                    user_id: this.user_id,
                    wallet_id: this.wallet_id,
                    description: this.description,
                    price: this.price,
                    type: this.type,
                    active: this.active,
                    due_at: this.due_at,
                },
            });
            return create;
        } catch (error) {
            console.log(error);
        } finally {
            prisma.$disconnect();
        }
    }
}
