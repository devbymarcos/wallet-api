import { prisma } from "../database/prismaClient.js";
import { InvoiceTypes } from "./modelsType.js";
class Invoice {
    id;
    user_id;
    wallet_id;
    category_id;
    invoice_of;
    name;
    description;
    price;
    due_at;
    type;
    pay;
    repeat_when;
    period;
    due_year;
    due_month;
    typeTransfer;

    constructor({
        id,
        user_id,
        wallet_id,
        category_id,
        invoice_of,
        name,
        description,
        price,
        due_at,
        type,
        pay,
        repeat_when,
        period,
        due_year,
        due_month,
        typeTransfer,
    }: InvoiceTypes) {
        this.id = id;
        this.user_id = user_id;
        this.wallet_id = wallet_id;
        this.category_id = category_id;
        this.invoice_of = invoice_of;
        this.name = name;
        this.description = description;
        this.price = price;
        this.due_at = due_at;
        this.type = type;
        this.pay = pay;
        this.repeat_when = repeat_when;
        this.period = period;
        this.due_month = due_month;
        this.due_year = due_year;
        this.typeTransfer = typeTransfer;
    }

    async findAllMonths() {
        try {
            const invoice: Array<any> = await prisma.$queryRaw`
            SELECT * FROM app_invoice WHERE user_id= ${this.user_id} AND type IN(${this.type},${this.typeTransfer}) AND wallet_id=${this.wallet_id} AND year(due_at) = ${this.due_year} AND month(due_at) = ${this.due_month} ORDER BY day(due_at)`;
            console.log(invoice);
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
                        category_id: this.category_id,
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
                    category_id: this.category_id,
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
                        user_id: user_id,
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
