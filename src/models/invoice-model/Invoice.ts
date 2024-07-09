import { prisma } from "../../database/prismaClient.js";
import { InvoiceTypes } from "./types";
class Invoice {
    id!: number;
    user_id!: number;
    wallet_id!: number;
    ds_wallet!: string;
    category_id!: number;
    ds_category!: string;
    invoice_of!: number;
    name!: string;
    description!: string;
    price!: number;
    due_at!: Date;
    type!: string;
    pay!: string;
    repeat_when!: string;
    period!: string;
    date_init!: string;
    date_end!: string;
    typeTransfer!: string;

    async findAllMonths() {
        try {
            const invoice: Array<any> = await prisma.$queryRaw`
            SELECT * FROM app_invoice WHERE due_at BETWEEN ${this.date_init} AND ${this.date_end}  AND user_id= ${this.user_id} AND wallet_id = ${this.wallet_id}  ORDER BY day(due_at)  DESC`;

            return invoice;
        } catch (err) {
            console.log(err);
            return false;
        } finally {
            prisma.$disconnect();
        }
    }

    async findById() {
        try {
            const invoice = await prisma.app_invoice.findUnique({
                where: {
                    id: this.id,
                },
            });
            return invoice;
        } catch (err) {
            console.log(err);
            return false;
        } finally {
            prisma.$disconnect();
        }
    }
    async update() {
        try {
            try {
                const invoice = await prisma.app_invoice.update({
                    where: {
                        id: this.id,
                    },
                    data: {
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
                        //name: this.name,
                    },
                });
                return invoice;
            } catch (err) {
                console.log(err);
                return false;
            } finally {
                prisma.$disconnect();
            }
        } catch (err) {
            console.log(err);
            return false;
        }
    }
    async register() {
        try {
            const invoice = await prisma.app_invoice.create({
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
            return invoice;
        } catch (err) {
            console.log(err);
            return false;
        } finally {
            prisma.$disconnect();
        }
    }

    async delete() {
        try {
            const invoice = await prisma.app_invoice.delete({
                where: {
                    id: this.id,
                },
            });
            return invoice;
        } catch (err) {
            console.log(err);
            return false;
        } finally {
            prisma.$disconnect();
        }
    }

    static async createInstallments(arrData: any[]) {
        try {
            const invoices = await prisma.app_invoice.createMany({
                data: arrData,
            });

            return invoices;
        } catch (err) {
            console.log(err);
            return false;
        } finally {
            prisma.$disconnect();
        }
    }

    async updatePay() {
        try {
            try {
                const invoice = await prisma.app_invoice.update({
                    where: {
                        id: this.id,
                    },
                    data: {
                        pay: this.pay,
                    },
                });
                return invoice;
            } catch (err) {
                console.log(err);
                return false;
            } finally {
                prisma.$disconnect();
            }
        } catch (err) {
            console.log(err);
            return false;
        }
    }

    static async groupWalletSumIdType(user_id: number | undefined) {
        try {
            try {
                const invoice = await prisma.app_invoice.groupBy({
                    by: ["wallet_id", "type"],
                    where: {
                        AND: [{ user_id: user_id }, { pay: "paid" }],
                    },

                    _sum: {
                        price: true,
                    },
                });
                return invoice;
            } catch (err) {
                console.log(err);
                return false;
            } finally {
                prisma.$disconnect();
            }
        } catch (err) {
            console.log(err);
            return false;
        }
    }
}

export default Invoice;
