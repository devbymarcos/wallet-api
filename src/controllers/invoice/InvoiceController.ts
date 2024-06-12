import { Request, Response } from "express";
import { dataReturn } from "../../helpers/functions";
import DashBoard from "../../models/dash-model/Dash";
import Invoice from "../../models/invoice-model/Invoice";

export const invoice = async (req: Request, res: Response) => {
    let date_init: any, date_end: any, walletId: any;

    if (req.query.date_one == "undefined" || !req.query.date_one) {
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
        console.log(walletId);
    }

    const income = new Invoice();

    income.id = 0;
    income.user_id = res.locals.userAuth.id;
    income.wallet_id = walletId;
    income.category_id = 0;
    income.date_init = date_init;
    income.date_end = date_end;

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
            // TODO REFACTOR
            const invoice = new Invoice();
            invoice.id = 0;
            invoice.user_id = res.locals.userAuth.id;
            invoice.wallet_id = parseInt(req.body.wallet_id);
            invoice.category_id = parseInt(req.body.category_id);
            invoice.description = req.body.description;
            invoice.price = parseFloat(req.body.price);
            invoice.due_at = new Date(req.body.due_at);
            invoice.type =
                req.body.repeat_when === "fixed"
                    ? "fixed_" + req.body.type
                    : req.body.type;
            invoice.pay = req.body.pay;
            invoice.repeat_when = req.body.repeat_when;
            invoice.period = !req.body.period ? "month" : req.body.period;
            invoice.name = "invoice";
            const data = await invoice.register();

            res.json(dataReturn([data], "invoice"));
    }
};

export const update = async (req: Request, res: Response) => {
    //TODO valid data
    if (req.body.action && req.body.action === "status") {
        const invoice = new Invoice();
        invoice.id = req.body.id;
        invoice.pay = req.body.pay === "unpaid" ? "paid" : "unpaid";
        invoice.wallet_id = 0;
        invoice.category_id = 0;

        const data = await invoice.updatePay();
        res.json(dataReturn(data, "invoice"));
    } else {
        const invoice = new Invoice();

        invoice.id = parseInt(req.body.id);
        invoice.wallet_id = parseInt(req.body.wallet_id);
        invoice.category_id = parseInt(req.body.category_id);
        invoice.description = req.body.description;
        invoice.price = parseFloat(req.body.price);
        invoice.due_at = new Date(req.body.due_at);
        invoice.type = req.body.type;
        invoice.pay = req.body.pay;
        invoice.repeat_when = req.body.repeat_when;
        invoice.period = req.body.period;

        const data = await invoice.update();

        res.json(dataReturn([data], "invoice"));
    }
};

export const remove = async (req: Request, res: Response) => {
    //TODO VALIDA DADOS
    const invoice = new Invoice();
    invoice.user_id = res.locals.userAuth.id;
    invoice.id = parseInt(req.params.id);
    invoice.wallet_id = 0;
    invoice.category_id = 0;
    const data = await invoice.delete();

    res.json(dataReturn(data, "invoice"));
};

export const invoiceSingle = async (req: Request, res: Response) => {
    //TODO validar dados

    const invoice = new Invoice();
    invoice.id = parseInt(req.params.id);
    const data = await invoice.findById();

    res.json(dataReturn([data], "invoice"));
};

export const dashBoard = async (req: Request, res: Response) => {
    //TODO VALIDAR OS DADOS

    const user_id: number = res.locals.userAuth.id;
    const wallet_id: number = Number(req.query.wallet_id);
    const dash = new DashBoard(user_id, wallet_id);

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

    const invoiceOut = new Invoice();
    invoiceOut.id = 0;
    invoiceOut.user_id = res.locals.userAuth.id;
    invoiceOut.wallet_id = parseInt(req.body.wallet_exit);
    invoiceOut.category_id = parseInt(req.body.category_id);
    invoiceOut.description = req.body.description;
    invoiceOut.price = parseFloat(req.body.price);
    invoiceOut.due_at = new Date(year, month, day);
    invoiceOut.type = "expense";
    invoiceOut.pay = "paid";
    invoiceOut.repeat_when = "single";
    invoiceOut.period = "month";
    invoiceOut.name = "";

    const invoiceIn = new Invoice();

    invoiceIn.id = 0;
    invoiceIn.user_id = res.locals.userAuth.id;
    invoiceIn.wallet_id = parseInt(req.body.wallet_entry);
    invoiceIn.category_id = parseInt(req.body.category_id);
    invoiceIn.description = req.body.description;
    invoiceIn.price = parseFloat(req.body.price);
    invoiceIn.due_at = new Date(year, month, day);
    invoiceIn.type = "income";
    invoiceIn.pay = "paid";
    invoiceIn.repeat_when = "single";
    invoiceIn.period = !req.body.period ? "month" : req.body.period;
    invoiceIn.name = "";

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
