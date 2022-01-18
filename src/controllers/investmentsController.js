import { Invoice } from "../models/Invoice.js";
import * as DataList from "../helpers/listCreate.js";

export const create = async (req, res) => {
    const invest = await Invoice.findAll({
        where: {
            user_id: req.session.user,
            wallet_id: 26,
        },
        order: [["due_at", "DESC"]],
    });
    let dataInvest = DataList.dataFormat(invest);

    let totalIncome = 0;
    let totalExpense = 0;

    invest.forEach((item) => {
        if (item.type === "income") {
            totalIncome += item.price;
        } else {
            totalExpense += item.price;
        }
    });

    const total = totalIncome - totalExpense;

    res.render("pages/widgets/investment/investment", {
        dataInvest,
        total: total.toLocaleString("pt-br", {
            style: "currency",
            currency: "BRL",
        }),
    });
};
