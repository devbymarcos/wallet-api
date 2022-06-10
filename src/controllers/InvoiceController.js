import { prisma } from "../database/prismaClient.js";
import { formatDateView } from "../helpers/hooks.js";

export const openInvoice = async (req, res) => {
    const { id } = req.dataUser;
    //INCOME && EXPENSE

    const userId = id;
    const p = "unpaid";
    const invoice = await prisma.$queryRaw`
        SELECT *  FROM app_invoice WHERE user_id= ${userId} AND pay = ${p} AND type IN('income','expense')  AND due_at < DATE(NOW())`;

    let openInvoiceFormat = invoice.map((item) => {
        let obj = {};

        //formata status
        let statusPay = "";
        if (item.pay === "paid") {
            statusPay = true;
        } else {
            statusPay = false;
        }
        obj.id = item.id;
        obj.description = item.description;
        obj.price = item.price.toLocaleString("pt-br", {
            style: "currency",
            currency: "BRL",
        });
        obj.pay = statusPay;
        obj.due_at = formatDateView(item.due_at);
        // criando a rota para edicão
        let r = "";
        if (item.type === "expense") {
            r = "despesa-edit";
        } else {
            r = "receita-edit";
        }
        obj.router = r;
        return obj;
    });

    res.json({
        openInvoice: openInvoiceFormat,
    });
};

export const dataChart = async (req, res) => {
    const { id } = req.dataUser;
    const walletSearchId = req.body.wallet;
    let dateChart = new Date();

    let chartMonths = [];
    for (let i = 0; i < 4; i++) {
        if (i === 0) {
            dateChart.setMonth(dateChart.getMonth());
        } else {
            dateChart.setMonth(dateChart.getMonth() - 1);
        }
        chartMonths.push(
            dateChart.getMonth() + 1 + "/" + dateChart.getFullYear()
        );
    }

    let chart = "";
    if (walletSearchId === "all") {
        chart = await prisma.$queryRaw`
            SELECT year(due_at) as due_year,month(due_at) as due_month,DATE_FORMAT (due_at,'%m/%y') AS due_date,(SELECT SUM(price) FROM app_invoice WHERE user_id = ${id} AND pay = 'paid' AND type = 'income' AND year(due_at) = due_year AND month(due_at) = due_month) as income,(SELECT SUM(price) FROM app_invoice WHERE user_id = ${id} AND pay = 'paid' AND type = 'expense' AND year(due_at) = due_year AND month(due_at) = due_month) as expense FROM app_invoice WHERE user_id = ${id} AND pay = 'paid' AND due_at >= date(now()- INTERVAL 4 MONTH) GROUP BY due_year, due_month, due_date ORDER BY due_year , due_month ASC  limit 5 `;
    } else {
        chart = await prisma.$queryRaw`
            SELECT year(due_at) as due_year,month(due_at) as due_month,DATE_FORMAT (due_at,'%m/%y') AS due_date,(SELECT SUM(price) FROM app_invoice WHERE user_id = ${id} AND pay = 'paid' AND type = 'income' AND year(due_at) = due_year AND month(due_at) = due_month AND wallet_id = ${walletSearchId}) as income,(SELECT SUM(price) FROM app_invoice WHERE user_id = ${id} AND pay = 'paid' AND type = 'expense' AND year(due_at) = due_year AND month(due_at) = due_month AND wallet_id = ${walletSearchId}) as expense FROM app_invoice WHERE user_id = ${id} AND pay = 'paid'AND wallet_id = ${walletSearchId} AND due_at >= date(now()- INTERVAL 4 MONTH) GROUP BY due_year , due_month ,due_date ORDER BY due_year , due_month ASC  limit 5`;
    }

    let chartCategories = [];
    let chartExpense = [];
    let chartIncome = [];

    chart.forEach((item) => {
        chartCategories.push(item.due_month + "/" + item.due_year);
        chartExpense.push(item.expense);
        chartIncome.push(item.income);
    });

    let dataBase = "";
    if (chart.length < 1) {
        dataBase = {
            months: chartMonths.reverse(),
            income: [0, 0, 0, 0],
            expense: [0, 0, 0, 0],
        };
    } else {
        dataBase = {
            months: chartCategories,
            income: chartIncome,
            expense: chartExpense,
        };
    }

    res.json(dataBase);
};

export const panelsData = async (req, res) => {
    const { id } = req.dataUser;
    const walletSearchId = req.body.wallet;
    let walletBalance = "";
    let currentDate = new Date();
    let receivedMonth = "";
    let paidMonth = "";

    if (walletSearchId === "all") {
        walletBalance = await prisma.$queryRaw`
            "SELECT (SELECT SUM(price) FROM app_invoice WHERE user_id= ${id} AND pay = 'paid' AND type = 'income') as income,(select SUM(price) FROM app_invoice WHERE user_id= ${id} AND pay = 'paid' AND type = 'expense') as expense from app_invoice WHERE user_id = ${id} and pay = 'paid' group by income,expense`;

        try {
            receivedMonth = await prisma.$queryRaw`
                "SELECT  SUM(price) as incomeMonth FROM app_invoice WHERE user_id = ${id} AND pay = 'paid' AND month(due_at) = ${
                currentDate.getMonth() + 1
            } AND year(due_at) = ${currentDate.getFullYear()} AND type = 'income'`;
        } catch (error) {
            console.log(error);
        }
        paidMonth = await prisma.$queryRaw`
            "SELECT  SUM(price) as expenseMonth FROM app_invoice WHERE user_id = ${id} AND pay = 'paid' AND month(due_at) = ${
            currentDate.getMonth() + 1
        } AND year(due_at) = ${currentDate.getFullYear()} AND type = 'expense'"`;
    } else {
        walletBalance =
            await prisma.$queryRaw`SELECT (SELECT SUM(price) FROM app_invoice WHERE user_id= ${id} AND pay = 'paid' AND type = 'income' AND wallet_id = ${walletSearchId}) as income,(select SUM(price) FROM app_invoice WHERE user_id= ${id} AND pay = 'paid' AND type = 'expense' AND wallet_id = ${walletSearchId}) as expense from app_invoice WHERE user_id = ${id} AND pay = 'paid' AND wallet_id = ${walletSearchId} group by income,expense`;

        try {
            receivedMonth =
                await prisma.$queryRaw`SELECT  SUM(price) as incomeMonth FROM app_invoice WHERE user_id = ${id} AND pay = 'paid' AND month(due_at) = ${
                    currentDate.getMonth() + 1
                } AND year(due_at) = ${currentDate.getFullYear()} AND type = 'income' AND wallet_id = ${walletSearchId}`;
        } catch (error) {
            console.log(error);
        }

        paidMonth =
            await prisma.$queryRaw`SELECT  SUM(price) as expenseMonth FROM app_invoice WHERE user_id = ${id} AND pay = 'paid' AND month(due_at) = ${
                currentDate.getMonth() + 1
            } AND year(due_at) = ${currentDate.getFullYear()} AND type = 'expense' AND wallet_id = ${walletSearchId}`;
    }

    let panels = "";
    if (walletBalance.length < 1) {
        panels = false;
        res.json(panels);
        return;
    }

    panels = {
        balance: walletBalance[0].income - walletBalance[0].expense,
        received: receivedMonth[0].incomeMonth
            ? receivedMonth[0].incomeMonth
            : 0.0,
        paid: paidMonth[0].expenseMonth ? paidMonth[0].expenseMonth : 0,
        balanceMonth: receivedMonth[0].incomeMonth - paidMonth[0].expenseMonth,
    };

    res.json(panels);
};
