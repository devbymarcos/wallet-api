import { prisma } from "../../database/prismaClient";
import Invoice from "../invoice-model/Invoice";
import Wallet from "../wallet-model/Wallet";
import { DashTypes } from "./types";

class DashBoard {
    user_id;
    wallet_id;

    constructor(user_id: number, wallet_id: number) {
        this.user_id = user_id;
        this.wallet_id = wallet_id;
    }

    async balance() {
        try {
            const balance: any =
                await prisma.$queryRaw`SELECT (SELECT SUM(price) FROM app_invoice WHERE user_id= ${this.user_id} AND pay = 'paid' AND type = 'income' AND wallet_id = ${this.wallet_id}) as income,(SELECT SUM(price) FROM app_invoice WHERE user_id= ${this.user_id} AND pay = 'paid' AND type = 'expense' AND wallet_id = ${this.wallet_id}) as expense from app_invoice WHERE user_id = ${this.user_id} AND pay = 'paid' AND wallet_id = ${this.wallet_id} group by income,expense`;
            const balanceSum = balance[0].income - balance[0].expense;
            return balanceSum;
        } catch (err) {
            console.log(err);
            const balanceSum = 0;
            return balanceSum;
        } finally {
            prisma.$disconnect();
        }
    }

    async receivedMonth() {
        try {
            const currentDate: Date = new Date();
            const receivedMonth: Array<{ incomeMonth: number }> =
                await prisma.$queryRaw`SELECT  SUM(price) as incomeMonth FROM app_invoice WHERE user_id = ${
                    this.user_id
                } AND pay = 'paid' AND wallet_id = ${
                    this.wallet_id
                } AND month(due_at) = ${
                    currentDate.getMonth() + 1
                } AND year(due_at) = ${currentDate.getFullYear()} AND type = 'income'`;

            return {
                receivedMonth: receivedMonth[0].incomeMonth,
            };
        } catch (err) {
            console.log(err);
            return {
                receivedMonth: [0],
            };
        } finally {
            prisma.$disconnect();
        }
    }
    async paidMonth() {
        try {
            const currentDate = new Date();
            const paidMonth: Array<{ expenseMonth: number }> =
                await prisma.$queryRaw`SELECT  SUM(price) as expenseMonth FROM app_invoice WHERE user_id = ${
                    this.user_id
                } AND pay = 'paid' AND wallet_id = ${
                    this.wallet_id
                } AND month(due_at) = ${
                    currentDate.getMonth() + 1
                } AND year(due_at) = ${currentDate.getFullYear()} AND type = 'expense'`;

            return {
                paidMonth: paidMonth[0].expenseMonth,
            };
        } catch (err) {
            console.log(err);
            return {
                paidMonth: [0],
            };
        } finally {
            prisma.$disconnect();
        }
    }

    async resultLastFourMonth() {
        try {
            const result: Array<{
                due_year: number;
                due_month: number;
                due_date: string;
                income: number;
                expense: number;
            }> = await prisma.$queryRaw`
            SELECT year(due_at) as due_year,month(due_at) as due_month,DATE_FORMAT (due_at,'%m/%y') AS due_date,(SELECT SUM(price) FROM app_invoice WHERE user_id = ${this.user_id} AND pay = 'paid' AND type = 'income'AND wallet_id = ${this.wallet_id} AND year(due_at) = due_year AND month(due_at) = due_month ) as income,(SELECT SUM(price) FROM app_invoice WHERE user_id = ${this.user_id} AND pay = 'paid' AND type = 'expense' AND wallet_id = ${this.wallet_id} AND year(due_at) = due_year AND month(due_at) = due_month ) as expense FROM app_invoice WHERE user_id = ${this.user_id} AND pay = 'paid' AND due_at >= date(now()- INTERVAL 4 MONTH) GROUP BY due_year , due_month ,due_date ORDER BY due_year , due_month ASC  limit 5`;

            let months: Array<string> = [];
            let values: Array<number> = [];

            result.forEach((item) => {
                months.push(item.due_month + "/" + item.due_year);
                values.push(item.income - item.expense);
            });

            return {
                months: months,
                values: values,
            };
        } catch (err) {
            console.log(err);
            return {
                months: ["not found"],
                values: [0],
            };
        } finally {
            prisma.$disconnect();
        }
    }
    async invoiceOpen() {
        try {
            const open = await prisma.app_invoice.findMany({
                where: {
                    AND: [
                        { user_id: this.user_id },
                        { due_at: { lt: new Date() } },
                        { pay: "unpaid" },
                        { wallet_id: this.wallet_id },
                    ],
                },
            });
            return open;
        } catch (err) {
            console.log(err);
            return false;
        } finally {
            prisma.$disconnect();
        }
    }
}

export default DashBoard;
