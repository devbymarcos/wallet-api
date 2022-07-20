import { prisma } from "../database/prismaClient.js";
import { formatDateView } from "../helpers/hooks.js";

export const openInvoice = async (req, res) => {
    const { id } = req.userSession;
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
    const { id } = req.userSession;
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
        chart =
            await prisma.$queryRaw`SELECT year(due_at) as due_year,month(due_at) as due_month,DATE_FORMAT (due_at,'%m/%y') AS due_date,(SELECT SUM(price) FROM app_invoice WHERE user_id = ${id} AND pay = 'paid' AND type = 'income' AND year(due_at) = due_year AND month(due_at) = due_month) as income,(SELECT SUM(price) FROM app_invoice WHERE user_id = ${id} AND pay = 'paid' AND type = 'expense' AND year(due_at) = due_year AND month(due_at) = due_month) as expense FROM app_invoice WHERE user_id = ${id} AND pay = 'paid' AND due_at >= date(now()- INTERVAL 4 MONTH) GROUP BY due_year, due_month, due_date ORDER BY due_year , due_month ASC  limit 5 `;
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
    const { id } = req.userSession;
    const walletSearchId = req.body.wallet;
    let walletBalance = "";
    let currentDate = new Date();
    let receivedMonth = "";
    let paidMonth = "";

    if (walletSearchId === "all") {
        walletBalance = await prisma.$queryRaw`
            SELECT (SELECT SUM(price) FROM app_invoice WHERE user_id= ${id} AND pay = 'paid' AND type = 'income') as income,(SELECT SUM(price) FROM app_invoice WHERE user_id= ${id} AND pay = 'paid' AND type = 'expense') as expense from app_invoice WHERE user_id = ${id} and pay = 'paid' GROUP BY income,expense`;

        try {
            receivedMonth = await prisma.$queryRaw`
                SELECT  SUM(price) as incomeMonth FROM app_invoice WHERE user_id = ${id} AND pay = 'paid' AND month(due_at) = ${
                currentDate.getMonth() + 1
            } AND year(due_at) = ${currentDate.getFullYear()} AND type = 'income'`;
        } catch (error) {
            console.log(error);
        }
        paidMonth = await prisma.$queryRaw`
            SELECT  SUM(price) as expenseMonth FROM app_invoice WHERE user_id = ${id} AND pay = 'paid' AND month(due_at) = ${
            currentDate.getMonth() + 1
        } AND year(due_at) = ${currentDate.getFullYear()} AND type = 'expense'`;
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

export const income = async (req, res) => {
    const { id } = req.userSession;
    const data = new Date();

    let dateInput = req.query.date;
    let dateArr = "";
    if (dateInput) {
        dateArr = dateInput.split("-");
    }

    let due_month = dateArr[0] ? parseInt(dateArr[0]) : data.getMonth() + 1;
    let due_year = dateArr[1] ? parseInt(dateArr[1]) : data.getFullYear();

    const income = await prisma.$queryRaw`
        SELECT * FROM app_invoice WHERE user_id= ${id} AND type IN("income","transf-income") AND year(due_at) = ${due_year} AND month(due_at) = ${due_month} ORDER BY day(due_at)`;

    let dataIncome = [];
    income.forEach((item) => {
        // formata price
        let price = item.price.toLocaleString("pt-br", {
            style: "currency",
            currency: "BRL",
        });
        //formata status
        let statusPay = "";
        if (item.pay === "paid") {
            statusPay = true;
        } else {
            statusPay = false;
        }
        //cria novo objto com dados formatado
        dataIncome.push({
            id: item.id,
            date: formatDateView(item.due_at),
            description: item.description,
            status: statusPay,
            value: price,
        });
    });

    res.json({ dataIncome });
};

export const expense = async (req, res) => {
    const { id } = req.userSession;

    let data = new Date();
    let dateInput = req.query.date;
    let dateArr = "";
    if (dateInput) {
        dateArr = dateInput.split("-");
    }

    //gerar mes e ano para query
    let due_month = dateArr[0] ? parseInt(dateArr[0]) : data.getMonth() + 1;
    let due_year = dateArr[1] ? parseInt(dateArr[1]) : data.getFullYear();

    const expense = await prisma.$queryRaw`
        SELECT * FROM app_invoice WHERE user_id= ${id} AND type IN("expense","transf-expense") AND year(due_at) = ${due_year} AND month(due_at) = ${due_month} ORDER BY day(due_at)`;

    let dataExpense = [];
    expense.forEach((item) => {
        //formata data

        let dateFormat = formatDateView(item.due_at);
        let price = item.price.toLocaleString("pt-br", {
            style: "currency",
            currency: "BRL",
        });
        //formata status
        let statusPay = "";
        if (item.pay === "paid") {
            statusPay = true;
        } else {
            statusPay = false;
        }
        //cria novo objto com dados formatado
        dataExpense.push({
            id: item.id,
            date: dateFormat,
            description: item.description,
            status: statusPay,
            value: price,
        });
    });

    res.json({ dataExpense });
};

export const create = async (req, res) => {
    const id = req.userSession.id;

    if (!req.body.description) {
        res.json({ message: "Preencha a descrição", type: "warning" });
        return;
    } else if (!req.body.price) {
        res.json({ message: "Preencha o valor", type: "warning" });
        return;
    } else if (!req.body.category) {
        res.json({ message: "Escolha a categoria", type: "warning" });
        return;
    } else if (!req.body.wallet) {
        res.json({ message: "Escolha a carteira", type: "warning" });
        return;
    } else if (!req.body.date) {
        res.json({ message: "É necessario a data", type: "warning" });
        return;
    }

    //remove o ponto da mascara do input
    // const priceReplace = req.body.price.replace(".", "");

    if (req.body.repeat_when === "installments") {
        const date = req.body.date;
        const dateArr1 = date.split("-");
        const [year, month, day] = dateArr1.map(Number);

        const data = new Date(year, month - 1, day);
        let dataDb = "";
        let dia = "";
        let mes = "";
        let ano = "";
        let p = 0;
        let dataPersist = [];
        for (let i = 0; i < req.body.installments; i++) {
            p++;
            if (i === 0) {
                data.setMonth(data.getMonth());
            } else {
                data.setMonth(data.getMonth() + 1);
            }

            dia = data.getDate();
            mes = data.getMonth() + 1;
            ano = data.getFullYear();
            dataDb = new Date(ano, mes - 1, dia);
            dataPersist.push({
                user_id: id,
                wallet_id: parseInt(req.body.wallet),
                category_id: parseInt(req.body.category),
                description:
                    req.body.description +
                    " parcela " +
                    p +
                    "/" +
                    req.body.installments,
                price: parseFloat(req.body.price.replace(",", ".")),
                due_at: dataDb,
                type: req.body.type,
                pay: "unpaid",
                period: !req.body.period ? "month" : req.body.period,
                repeat_when: req.body.repeat_when,
                name: "invoice",
            });
        }
        console.log("dados", dataPersist);

        try {
            const invoiceCreate = await prisma.app_invoice.createMany({
                data: dataPersist,
            });

            res.json({
                message: "Parcelas registradas: " + invoiceCreate.count,
            });
            return;
        } catch (err) {
            console.log(err);
        } finally {
            prisma.$disconnect();
        }
    } else {
        //end parcelado
        try {
            const date = req.body.date;
            const dateArr1 = date.split("-");
            const [year, month, day] = dateArr1.map(Number);
            const dateDB = new Date(year, month - 1, day);

            const invoiceCreate = await prisma.app_invoice.create({
                data: {
                    user_id: id,
                    wallet_id: parseInt(req.body.wallet),
                    category_id: parseInt(req.body.category),
                    description: req.body.description,
                    price: parseFloat(req.body.price.replace(",", ".")),
                    due_at: dateDB,
                    type:
                        req.body.repeat_when === "fixed"
                            ? "fixed_" + req.body.type
                            : req.body.type,
                    pay: req.body.repeat_when === "fixed" ? "paid" : "unpaid",
                    repeat_when: req.body.repeat_when,
                    period: !req.body.period ? "month" : req.body.period,
                    name: "invoice",
                },
            });
        } catch (err) {
            console.log(err);
            res.json({
                message: "Ooops não conseguimos salvar contate o Admin",
            });
        } finally {
            prisma.$disconnect();
        }
    }
};

export const modify = async (req, res) => {
    if (req.body.action && req.body.action === "update") {
        if (req.body.acao === "flash_list") {
            const incomeUpdate = await prisma.app_invoice.update(
                {
                    pay: req.body.pay,
                },
                {
                    where: {
                        id: req.body.id,
                    },
                }
            );
            if (!incomeUpdate) {
                res.json({
                    message: "Ooops, algo deu errado, contate o admin",
                    type: "error",
                });
                return;
            }

            res.json({ message: "Registro Atualizado", type: "success" });
        } else {
            if (!req.body.description) {
                res.json({ message: "Preencha a descrição", type: "warning" });
                return;
            } else if (!req.body.price) {
                res.json({ message: "Preencha o valor", type: "warning" });
                return;
            } else if (!req.body.category) {
                res.json({ message: "Escolha a categoria", type: "warning" });
            } else if (!req.body.wallet) {
                res.json({ message: "Escolha a carteira", type: "warning" });
            } else if (!req.body.date) {
                res.json({ message: "É necessario a data", type: "warning" });
            }
            //remove o ponto da mascara do input
            const priceReplace = req.body.price.replace(".", "");
            const incomeUpdate = await Invoice.update(
                {
                    wallet_id: req.body.wallet,
                    category_id: req.body.category,
                    description: req.body.description,
                    price: parseFloat(priceReplace.replace(",", ".")),
                    due_at: req.body.date,
                    type: "income",
                    pay: req.body.pay,
                    repeat_when: req.body.repeat_when,
                    period: !req.body.period ? "month" : req.body.period,
                },
                {
                    where: {
                        id: req.body.id,
                    },
                }
            );

            if (!incomeUpdate) {
                res.json({
                    message: "Ooops, algo deu errado, contate o admin",
                    type: "error",
                });
                return;
            }

            res.json({ message: "Registro Atualizado", type: "success" });
        }
    }
};

export const drop = async (req, res) => {
    if (req.body.action && req.body.action === "delete") {
        const incomeDelete = await Invoice.destroy({
            where: {
                id: req.body.id,
            },
        });

        if (!incomeDelete) {
            res.json({
                message: "Ooops, algo deu errado, contate o admin",
                type: "error",
            });
            return;
        }
        res.json({ redirect: "/receitas" });
        return;
    }
};
