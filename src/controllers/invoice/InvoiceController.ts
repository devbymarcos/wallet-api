import { Request, Response } from "express";
import { dataReturn } from "../../helpers/functions";
import DashBoard from "../../models/dash-model/Dash";
import Invoice from "../../models/invoice-model/Invoice";

export const invoice = async (req: Request, res: Response) => {
    let date_init: any, date_end: any, walletId: any;

    if (req.query.date_one == "undefined") {
        const date = new Date();
        date_init = `${date.getFullYear()}-${date.getMonth() + 1}-01`;
        console.log(date_init);
        const lastDayOfMonth = new Date(
            date.getFullYear(),
            date.getMonth() + 1,
            0
        );
        date_end = lastDayOfMonth.toISOString().split("T")[0];
        walletId = req.query.walletId;
    } else {
        date_init = req.query.date_one;
        date_end = req.query.date_two;
        walletId = req.query.walletId;
    }

    const incomeObj = {
        id: 0,
        user_id: res.locals.userAuth.id,
        wallet_id: walletId,
        category_id: 0,
        date_init: date_init,
        date_end: date_end,
    };
    const income = new Invoice(incomeObj);
    const data = await income.findAllMonths();

    res.json(dataReturn(data, "/invoice"));
};

export const create = async (req: Request, res: Response) => {
    //TODO VALIDAR DADOS VINDO DPO FRONT EXEMPLO ABAIXO

    switch (req.body.repeat_when) {
        case "installments":
            const date = req.body.due_at;
            const dateSplit = date.split("-");
            const [year, month, day] = dateSplit.map(Number);
            const dateInstance = new Date(year, month - 1, day);

            let dataDb: Date;
            let dia: number;
            let mes: number;
            let ano: number;
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
                    user_id: res.locals.userAuth.id,
                    wallet_id: parseInt(req.body.wallet_id),
                    category_id: parseInt(req.body.category_id),
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

            const dataInstallments = await Invoice.createInstallments(
                dataPersist
            );

            res.json(dataReturn(dataInstallments, "invoice"));

            break;
        case "single":
            const invoiceObj = {
                id: 0,
                user_id: res.locals.userAuth.id,
                wallet_id: parseInt(req.body.wallet_id),
                category_id: parseInt(req.body.category_id),
                description: req.body.description,
                price: parseFloat(req.body.price),
                due_at: new Date(req.body.due_at),
                type:
                    req.body.repeat_when === "fixed"
                        ? "fixed_" + req.body.type
                        : req.body.type,
                pay: req.body.pay,
                repeat_when: req.body.repeat_when,
                period: !req.body.period ? "month" : req.body.period,
                name: "invoice",
            };

            const invoice = new Invoice(invoiceObj);
            const data = await invoice.register();

            res.json(dataReturn([data], "invoice"));
    }
};

export const update = async (req: Request, res: Response) => {
    //TODO valid data
    if (req.body.action && req.body.action === "status") {
        const invoiceObj = {
            id: req.body.id,
            pay: req.body.pay === "unpaid" ? "paid" : "unpaid",
            wallet_id: 0,
            category_id: 0,
        };
        const invoice = new Invoice(invoiceObj);
        const data = await invoice.updatePay();
        res.json(dataReturn(data, "invoice"));
    } else {
        const invoiceObj = {
            id: parseInt(req.body.id),
            wallet_id: parseInt(req.body.wallet_id),
            category_id: parseInt(req.body.category_id),
            description: req.body.description,
            price: parseFloat(req.body.price),
            due_at: new Date(req.body.due_at),
            type: req.body.type,
            pay: req.body.pay,
            repeat_when: req.body.repeat_when,
            period: req.body.period,
        };

        const invoice = new Invoice(invoiceObj);
        const data = await invoice.update();

        res.json(dataReturn([data], "invoice"));
    }
};

export const remove = async (req: Request, res: Response) => {
    //TODO VALIDA DADOS
    const invoiceObj = {
        user_id: res.locals.userAuth.id,
        id: parseInt(req.params.id),
        wallet_id: 0,
        category_id: 0,
    };

    const invoice = new Invoice(invoiceObj);
    const data = await invoice.delete();

    res.json(dataReturn(data, "invoice"));
};

export const invoiceSingle = async (req: Request, res: Response) => {
    //TODO validar dados
    const invoiceObj = {
        id: parseInt(req.params.id),
        wallet_id: 0,
        category_id: 0,
    };
    const invoice = new Invoice(invoiceObj);
    const data = await invoice.findById();

    res.json(dataReturn([data], "invoice"));
};

export const dashBoard = async (req: Request, res: Response) => {
    //TODO VALIDAR OS DADOS

    const dashObj = {
        user_id: res.locals.userAuth.id,
        wallet_id: Number(req.query.wallet_id),
    };

    const dash = new DashBoard(dashObj);

    const [result, paidMonth, receivedMonth, balanceSum, invoiceOpen] =
        await Promise.all([
            dash.resultLastFourMonth(),
            dash.paidMonth(),
            dash.receivedMonth(),
            dash.balance(),
            dash.invoiceOpen(),
        ]);

    const dataDash = {
        result: {
            months: result.months,
            values: result.values,
        },
        paidMonth: paidMonth.paidMonth,
        receivedMonth: receivedMonth.receivedMonth,
        balanceSum,
        invoiceOpen,
    };
    res.json(dataReturn(dataDash, "dash"));
};

export const transfers = async (req: Request, res: Response) => {
    //TODO validar dados

    const d = new Date(req.body.due_at);
    const day = d.getUTCDate();
    const year = d.getUTCFullYear();
    const month = d.getUTCMonth();

    const invoiceObjOut = {
        id: 0,
        user_id: res.locals.userAuth.id,
        wallet_id: parseInt(req.body.wallet_exit),
        category_id: parseInt(req.body.category_id),
        description: req.body.description,
        price: parseFloat(req.body.price),
        due_at: new Date(year, month, day),
        type: "expense",
        pay: "paid",
        repeat_when: "single",
        period: "month",
        name: "",
    };

    const invoiceObjIn = {
        id: 0,
        user_id: res.locals.userAuth.id,
        wallet_id: parseInt(req.body.wallet_entry),
        category_id: parseInt(req.body.category_id),
        description: req.body.description,
        price: parseFloat(req.body.price),
        due_at: new Date(year, month, day),
        type: "income",
        pay: "paid",
        repeat_when: "single",
        period: !req.body.period ? "month" : req.body.period,
        name: "",
    };

    const invoiceOut = new Invoice(invoiceObjOut);
    const invoiceIn = new Invoice(invoiceObjIn);
    const dataIn = await invoiceIn.register();
    const dataOut = await invoiceOut.register();

    if (!dataIn && !dataOut) {
        res.json({
            data: false,
            message: "Algo aconteceu contate admin",
            request: "transfer",
        });
    }

    res.json(dataReturn([dataIn, dataOut], "transfer"));
};
