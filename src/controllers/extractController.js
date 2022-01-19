import { Invoice } from "../models/Invoice.js";
import * as FormatData from "../helpers/formatList.js";

export const create = async (req, res) => {
    res.render("pages/widgets/extract/extract");
};

export const extract = async (req, res) => {
    const extract = await Invoice.findAll({
        where: {
            user_id: req.session.user,
            wallet_id: 26,
        },
        order: [["due_at", "DESC"]],
    });

    let dataInvest = FormatData.dataFormat(invest);
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

    const data = {
        total: total,
        result: dataInvest,
    };
};
