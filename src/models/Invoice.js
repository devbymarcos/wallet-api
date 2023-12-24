import { prisma } from "../database/prismaClient.js";

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

    constructor(obj) {
        this.id = obj.id || null;
        this.user_id = obj.user_id || null;
        this.wallet_id = obj.wallet_id || null;
        this.category_id = obj.category_id || null;
        this.invoice_of = obj.invoice_of || null;
        this.name = obj.name || null;
        this.description = obj.description || null;
        this.price = obj.price || null;
        this.due_at = obj.due_at || null;
        this.type = obj.type || null;
        this.pay = obj.pay || null;
        this.repeat_when = obj.repeat_when || null;
        this.period = obj.period || null;
        this.due_month = obj.due_month || null;
        this.due_year = obj.due_year || null;
    }

    async findAllMonthsIncome() {
        try {
            const income = await prisma.$queryRaw`
            SELECT * FROM app_invoice WHERE user_id= ${this.user_id} AND type IN("income","transf-income") AND wallet_id=${this.wallet_id} AND year(due_at) = ${this.due_year} AND month(due_at) = ${this.due_month} ORDER BY day(due_at)`;
            return income;
            console.log(
                "TCL: Invoice -> findAllMonthsIncome -> income",
                income
            );
        } catch (err) {
            console.log(err);
            return false;
        } finally {
            prisma.$disconnect();
        }
    }

    async findAllMonthsExpense() {
        try {
            const income = await prisma.$queryRaw`
            SELECT * FROM app_invoice WHERE user_id= ${this.user_id} AND type IN("expense","transf-expense") AND wallet_id=${this.wallet_id} AND year(due_at) = ${due_year} AND month(due_at) = ${due_month} ORDER BY day(due_at)`;
        } catch (err) {
            console.log(err);
            return false;
        } finally {
            prisma.$disconnect();
        }
    }

    async findById() {
        try {
        } catch (err) {
            console.log(err);
            return false;
        } finally {
            prisma.$disconnect();
        }
    }

    async register() {
        try {
            const invoice = await prisma.app_invoice.create({
                data: {
                    user_id: id,
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
                    id: parseInt(this.id),
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
}

export default Invoice;
