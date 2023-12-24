import { prisma } from "../database/prismaClient.js";
import DashBoard from "../models/Dash.js";
import Invoice from "../models/Invoice.js";

export const income = async (req, res) => {
    const dateInput = req.query.date;
    let dateArr;
    if (dateInput) {
        dateArr = dateInput.split("-");
    }
    const incomeObj = {
        user_id: req.userAuth.id,
        wallet_id: req.query.currentWallet,
        due_month: dateArr[0]
            ? parseInt(dateArr[0])
            : new Date().getMonth() + 1,
        due_year: dateArr[1] ? parseInt(dateArr[1]) : data.getFullYear(),
    };
    const income = new Invoice(incomeObj);
    const data = await income.findAllMonthsIncome();
    console.log("TCL: income -> data", data);

    if (!data) {
        res.json({
            data: data,
            message: "Algo aconteceu contate admin",
            request: "category",
        });
        return;
    }

    if (data.length <= 0) {
        res.json({
            data: null,
            message: "não encontramos dados",
            request: "category",
        });

        return;
    }

    res.json({
        data: data,
        message: "",
        request: "income",
    });
};

export const expense = async (req, res) => {
    const { id } = req.userSession;

    let data = new Date();
    const currentWallet = req.query.currentWallet;
    let dateInput = req.query.date;
    let dateArr = "";
    if (dateInput) {
        dateArr = dateInput.split("-");
    }

    //gerar mes e ano para query
    let due_month = dateArr[0] ? parseInt(dateArr[0]) : data.getMonth() + 1;
    let due_year = dateArr[1] ? parseInt(dateArr[1]) : data.getFullYear();
    try {
        const expense = await prisma.$queryRaw`
        SELECT * FROM app_invoice WHERE user_id= ${id} AND type IN("expense","transf-expense") AND wallet_id=${currentWallet} AND year(due_at) = ${due_year} AND month(due_at) = ${due_month} ORDER BY day(due_at)`;

        let dataExpense = [];
        expense.forEach((item) => {
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
                date: item.due_at,
                description: item.description,
                status: statusPay,
                pay: item.pay,
                value: item.price,
            });
        });

        res.json({ dataExpense });
    } catch (error) {
        res.status(500);
        console.log(error);
    } finally {
        prisma.$disconnect();
    }
};

export const create = async (req, res) => {
    const { id } = req.userSession;
    console.log(req.body);

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
                price: parseFloat(req.body.price),
                due_at: dataDb,
                type: req.body.type,
                pay: "unpaid",
                period: !req.body.period ? "month" : req.body.period,
                repeat_when: req.body.repeat_when,
                name: "invoice",
            });
        }

        try {
            const invoiceCreate = await prisma.app_invoice.createMany({
                data: dataPersist,
            });

            res.json({
                message: "Parcelas registradas: " + invoiceCreate.count,
                type: "success",
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
                    price: parseFloat(req.body.price),
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
            console.log(invoiceCreate);
            res.json({ invoiceCreate });
        } catch (err) {
            console.log(err);
            res.json({
                message: "Ooops não conseguimos salvar contate o Admin",
                type: "warning",
            });
        } finally {
            prisma.$disconnect();
        }
    }
};

export const update = async (req, res) => {
    if (req.body.action === "status") {
        try {
            const incomeUpdate = await prisma.app_invoice.update({
                where: {
                    id: parseInt(req.body.id),
                },
                data: {
                    pay: req.body.pay === "unpaid" ? "paid" : "unpaid",
                },
            });
            if (incomeUpdate.id) {
                res.json({ incomeUpdate });
            } else {
                throw new Error("Ooops, algo deu errado, contate o admin");
            }
        } catch (err) {
            console.log(err);
            res.json({
                message: "Ooops, algo deu errado, contate o admin",
                type: "error",
            });
        } finally {
            prisma.$disconnect();
        }
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
        try {
            const incomeUpdate = await prisma.app_invoice.update({
                where: {
                    id: parseInt(req.body.id),
                },
                data: {
                    wallet_id: parseInt(req.body.wallet),
                    category_id: parseInt(req.body.category),
                    description: req.body.description,
                    price: parseFloat(req.body.price),
                    due_at: new Date(req.body.date),
                    type: req.body.type,
                    pay: req.body.pay,
                },
            });
            res.json({ message: "Registro Atualizado", type: "success" });
        } catch (err) {
            console.log(err);
            res.json({
                message: "Ooops, algo deu errado, contate o admin",
                type: "error",
            });
        } finally {
            prisma.$disconnect();
        }
    }
};

export const remove = async (req, res) => {
    //TODO VALIDA DADOS
    const invoiceObj = {
        user_id: req.userAuth.id,
        id: req.params.id,
    };

    const invoice = new Invoice(invoiceObj);
    const data = await invoice.delete();

    if (!data) {
        res.json({
            data: data,
            message: "Algo aconteceu contate admin",
            request: "invoice/:id",
        });
    }

    res.json({
        data: data,
        message: "Ok removido",
        request: "invoice/:id",
    });

    // try {
    //     const invoiceDelete = await prisma.app_invoice.delete({
    //         where: {
    //             id: parseInt(req.params.id),
    //         },
    //     });

    //     res.json(invoiceDelete);
    // } catch (err) {
    //     console.log(err);
    //     res.json({
    //         message: "Ooops algo deu errado contate o admin",
    //         type: "error",
    //     });
    // } finally {
    //     prisma.$disconnect();
    // }
};

export const invoiceSingle = async (req, res) => {
    const { id } = req.userSession;

    const getInvoiceSingle = await prisma.app_invoice.findUnique({
        where: {
            id: parseInt(req.params.id),
        },
    });

    let dataInvoice = {
        id: getInvoiceSingle.id,
        categoryId: getInvoiceSingle.category_id,
        walletId: getInvoiceSingle.wallet_id,
        type: getInvoiceSingle.type,
        date: getInvoiceSingle.due_at,
        value: getInvoiceSingle.price,
        statusPay: getInvoiceSingle.pay === "paid" ? true : false,
        pay: getInvoiceSingle.pay,
        description: getInvoiceSingle.description,
    };

    if (getInvoiceSingle.id) {
        res.json(dataInvoice);
        return;
    }
};

export const dashBoard = async (req, res) => {
    //TODO VALIDAR OS DADOS
    const dashObj = {
        user_id: req.userAuth.id,
        wallet_id: req.query.wallet_id,
    };

    const dash = new DashBoard(dashObj);
    const [months, values] = await dash.resultLastFourMonth();
    const [paidMonth] = await dash.paidMonth();
    const [receivedMonth] = await dash.receivedMonth();
    const [balanceSum] = await dash.balance();

    const dataDash = {
        result: {
            months,
            values,
        },
        paidMonth,
        receivedMonth,
        balanceSum,
    };

    res.json({
        data: dataDash,
        message: "",
        request: "dash",
    });
};

export const transfers = async (req, res) => {
    //TODO validar dados
    const { id } = req.userSession;
    const d = new Date(req.body.date);
    const day = d.getUTCDate();
    const year = d.getUTCFullYear();
    const month = d.getUTCMonth();

    const invoiceObjOut = {
        user_id: id,
        wallet_id: parseInt(req.body.wallet_exit),
        category_id: parseInt(req.body.category_exit),
        description: req.body.description,
        price: parseFloat(req.body.price.replace(",", ".")),
        due_at: new Date(year, month, day),
        type: "expense",
        pay: "paid",
        repeat_when: "single",
        period: !req.body.period ? "month" : req.body.period,
        name: "",
    };

    const invoiceObjIn = {
        user_id: id,
        wallet_id: parseInt(req.body.wallet_entry),
        category_id: parseInt(req.body.category_entry),
        description: req.body.description,
        price: parseFloat(req.body.price.replace(",", ".")),
        due_at: new Date(year, month, day),
        type: "income",
        pay: "paid",
        repeat_when: "single",
        period: !req.body.period ? "month" : req.body.period,
        name: "",
    };

    const invoiceOut = new Invoice(invoiceObjOut);
    const invoiceIn = new Invoice(invoiceObjIn);
    const dataIn = invoiceIn.register();
    const dataOut = invoiceOut.register();

    if (!dataIn && !dataOut) {
        res.json({
            data: false,
            message: "Algo aconteceu contate admin",
            request: "transfer",
        });
    }

    res.json({
        data: [dataIn, dataOut],
        message: "",
        request: "transfer",
    });
};
