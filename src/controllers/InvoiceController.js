import { prisma } from "../database/prismaClient.js";
import DashBoard from "../models/Dash.js";
import Invoice from "../models/Invoice.js";

export const invoice = async (req, res) => {
    const dateInput = req.query.date;
    let dateArr;
    if (dateInput) {
        dateArr = dateInput.split("-");
    }
    const incomeObj = {
        user_id: req.userAuth.id,
        wallet_id: req.query.wallet_id,
        due_month: dateArr[0]
            ? parseInt(dateArr[0])
            : new Date().getMonth() + 1,
        due_year: dateArr[1] ? parseInt(dateArr[1]) : data.getFullYear(),
        typeTransfer:
            req.query.type == "income" ? "transf-income" : "transf-expense",
        type: req.query.type,
    };
    const income = new Invoice(incomeObj);
    const data = await income.findAllMonths();

    if (!data) {
        res.json({
            data: data,
            message: "Algo aconteceu contate admin",
            request: "invoice",
        });
        return;
    }

    if (data.length <= 0) {
        res.json({
            data: null,
            message: "não encontramos dados",
            request: "invoice",
        });

        return;
    }
    res.json({
        data: data,
        message: "",
        request: "invoice",
    });
};

export const create = async (req, res) => {
    const { id } = req.userAuth;
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

    const date = req.body.date;
    const dateArr1 = date.split("-");
    const [year, month, day] = dateArr1.map(Number);
    const dateInstance = new Date(year, month - 1, day);
    //TODO CODANDO AQUI

    switch (expr) {
        case "installments":
            // const dateReq = req.body.date;
            // const dateArr1 = dateReq.split("-");
            // const [year, month, day] = dateArr1.map(Number);
            // const dateInstance = new Date(year, month - 1, day);

            let dataDb = "";
            let dia = "";
            let mes = "";
            let ano = "";
            let p = 0;
            let dataPersist = [];
            for (let i = 0; i < req.body.installments; i++) {
                p++;
                if (i === 0) {
                    dateInstance.setMonth(dateInstance.getMonth());
                } else {
                    dateInstance.setMonth(dateInstance.getMonth() + 1);
                }

                dia = dateInstance.getDate();
                mes = dateInstance.getMonth() + 1;
                ano = dateInstance.getFullYear();
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
            console.log(dataPersist);
            // const dataInstallments = await Invoice.createInstallments(
            //     dataPersist
            // );

            if (!data) {
                res.json({
                    data: data,
                    message: "Algo aconteceu contate admin",
                    request: "invoice",
                });
                return;
            }

            if (data.length <= 0) {
                res.json({
                    data: null,
                    message: "não encontramos dados",
                    request: "invoice",
                });

                return;
            }
            res.json({
                data: data,
                message: "",
                request: "invoice",
            });

            break;
        case "single":
            const invoiceObj = {
                user_id: id,
                wallet_id: parseInt(req.body.wallet),
                category_id: parseInt(req.body.category),
                description: req.body.description,
                price: parseFloat(req.body.price),
                due_at: dateInstance,
                type:
                    req.body.repeat_when === "fixed"
                        ? "fixed_" + req.body.type
                        : req.body.type,
                pay: req.body.repeat_when === "fixed" ? "paid" : "unpaid",
                repeat_when: req.body.repeat_when,
                period: !req.body.period ? "month" : req.body.period,
                name: "invoice",
            };

            const invoice = new Invoice(invoiceObj);
            const data = await invoice.register();
            if (!data) {
                res.json({
                    data: data,
                    message: "Algo aconteceu contate admin",
                    request: "invoice",
                });
                return;
            }

            if (data.length <= 0) {
                res.json({
                    data: null,
                    message: "não encontramos dados",
                    request: "invoice",
                });

                return;
            }
            res.json({
                data: data,
                message: "",
                request: "invoice",
            });
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
    //TODO validar dados
    const invoiceObj = {
        id: parseInt(req.params.id),
    };
    const invoice = new Invoice(invoiceObj);
    const data = await invoice.findById();

    if (!data) {
        res.json({
            data: data,
            message: "Algo aconteceu contate admin",
            request: "invoice",
        });
        return;
    }

    if (data.length <= 0) {
        res.json({
            data: null,
            message: "não encontramos dados",
            request: "invoice",
        });

        return;
    }
    res.json({
        data: data,
        message: "",
        request: "invoice",
    });
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
