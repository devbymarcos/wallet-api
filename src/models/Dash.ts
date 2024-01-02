import { prisma } from "../database/prismaClient.js";

class DashBoard {
    user_id;
    wallet_id;

    constructor(obj) {
        this.user_id = obj.user_id || null;
        this.wallet_id = obj.wallet_id || null;
    }

    async balance() {
        try {
            const balance =
                await prisma.$queryRaw`SELECT (SELECT SUM(price) FROM app_invoice WHERE user_id= ${this.user_id} AND pay = 'paid' AND type = 'income' AND wallet_id = ${this.wallet_id}) as income,(SELECT SUM(price) FROM app_invoice WHERE user_id= ${this.user_id} AND pay = 'paid' AND type = 'expense' AND wallet_id = ${this.wallet_id}) as expense from app_invoice WHERE user_id = ${this.user_id} AND pay = 'paid' AND wallet_id = ${this.wallet_id} group by income,expense`;
            const balanceSum = balance[0].income - balance[0].expense;

            return [balanceSum];
        } catch (err) {
            console.log(err);
            return false;
        } finally {
            prisma.$disconnect();
        }
    }

    async receivedMonth() {
        try {
            const currentDate = new Date();
            const receivedMonth =
                await prisma.$queryRaw`SELECT  SUM(price) as incomeMonth FROM app_invoice WHERE user_id = ${
                    this.user_id
                } AND pay = 'paid' AND month(due_at) = ${
                    currentDate.getMonth() + 1
                } AND year(due_at) = ${currentDate.getFullYear()} AND type = 'income' AND wallet_id = ${
                    this.wallet_id
                }`;

            return [receivedMonth[0].incomeMonth];
        } catch (err) {
            console.log(err);
            return false;
        } finally {
            prisma.$disconnect();
        }
    }
    async paidMonth() {
        try {
            const currentDate = new Date();
            const paidMonth =
                await prisma.$queryRaw`SELECT  SUM(price) as expenseMonth FROM app_invoice WHERE user_id = ${
                    this.user_id
                } AND pay = 'paid' AND month(due_at) = ${
                    currentDate.getMonth() + 1
                } AND year(due_at) = ${currentDate.getFullYear()} AND type = 'expense' AND wallet_id = ${
                    this.wallet_id
                }`;
            return [paidMonth[0].expenseMonth];
        } catch (err) {
            console.log(err);
            return false;
        } finally {
            prisma.$disconnect();
        }
    }

    async resultLastFourMonth() {
        try {
            const result = await prisma.$queryRaw`
            SELECT year(due_at) as due_year,month(due_at) as due_month,DATE_FORMAT (due_at,'%m/%y') AS due_date,(SELECT SUM(price) FROM app_invoice WHERE user_id = ${this.user_id} AND pay = 'paid' AND type = 'income' AND year(due_at) = due_year AND month(due_at) = due_month AND wallet_id = ${this.wallet_id}) as income,(SELECT SUM(price) FROM app_invoice WHERE user_id = ${this.user_id} AND pay = 'paid' AND type = 'expense' AND year(due_at) = due_year AND month(due_at) = due_month AND wallet_id = ${this.wallet_id}) as expense FROM app_invoice WHERE user_id = ${this.user_id} AND pay = 'paid'AND wallet_id = ${this.wallet_id} AND due_at >= date(now()- INTERVAL 4 MONTH) GROUP BY due_year , due_month ,due_date ORDER BY due_year , due_month ASC  limit 5`;

            let months = [];
            let values = [];

            result.forEach((item) => {
                months.push(item.due_month + "/" + item.due_year);
                values.push(item.income - item.expense);
            });

            return [months, values];
        } catch (err) {
            console.log(err);
        } finally {
            prisma.$disconnect();
        }
    }
}

export default DashBoard;
