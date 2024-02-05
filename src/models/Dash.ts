import { prisma } from "../database/prismaClient";
import Invoice from "./Invoice";
import Wallet from "./Wallet";
import { DashTypes } from "./modelsType";

class DashBoard {
    user_id;

    constructor(obj: DashTypes) {
        this.user_id = obj.user_id || undefined;
    }

    async balance() {
        try {
            const wallet = new Wallet({ user_id: this.user_id });
            const dataWallet = await wallet.findyAll();

            if (!dataWallet) return dataWallet;
            const walletIdToName: Record<number, string> = {};
            dataWallet.forEach((wallet) => {
                walletIdToName[wallet.id] = wallet.name;
            });

            const dataInvoice = await Invoice.groupWalletSumIdType(
                this.user_id
            );
            if (!dataInvoice) return dataInvoice;
            interface GroupedResult {
                [walletId: number]: {
                    expenses?: number | null;
                    income?: number | null;
                };
            }
            const groupedByWalletId: GroupedResult = dataInvoice.reduce(
                (acc, item) => {
                    const walletId: number = item.wallet_id;

                    acc[walletId] = acc[walletId] || {};

                    if (item.type === "expense") {
                        acc[walletId].expenses = item._sum.price;
                    } else if (item.type === "income") {
                        acc[walletId].income = item._sum.price;
                    }

                    return acc;
                },
                {} as GroupedResult
            );

            const resultArray: Array<{
                walletId: number;
                saldo: number;
                name: string;
            }> = Object.entries(groupedByWalletId).map(
                ([walletId, { expenses = 0, income = 0 }]) => {
                    const saldo = income - expenses;
                    return {
                        walletId: parseInt(walletId, 10),
                        saldo,
                        name: walletIdToName[Number(walletId)],
                    };
                }
            );

            return resultArray;
        } catch (err) {
            console.log(err);
            return {
                balanceSum: [],
            };
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
                } AND pay = 'paid' AND month(due_at) = ${
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
                } AND pay = 'paid' AND month(due_at) = ${
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
            SELECT year(due_at) as due_year,month(due_at) as due_month,DATE_FORMAT (due_at,'%m/%y') AS due_date,(SELECT SUM(price) FROM app_invoice WHERE user_id = ${this.user_id} AND pay = 'paid' AND type = 'income' AND year(due_at) = due_year AND month(due_at) = due_month ) as income,(SELECT SUM(price) FROM app_invoice WHERE user_id = ${this.user_id} AND pay = 'paid' AND type = 'expense' AND year(due_at) = due_year AND month(due_at) = due_month ) as expense FROM app_invoice WHERE user_id = ${this.user_id} AND pay = 'paid' AND due_at >= date(now()- INTERVAL 4 MONTH) GROUP BY due_year , due_month ,due_date ORDER BY due_year , due_month ASC  limit 5`;

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
