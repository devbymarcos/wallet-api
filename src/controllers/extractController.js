import { Invoice } from "../models/Invoice.js";
import { Wallet } from "../models/Wallet.js";
import * as FormatData from "../helpers/formatData.js";

export const create = async (req, res) => {
    const wallet = await Wallet.findAll({
        where: {
            user_id: req.session.user,
        },
    });
    res.render("pages/widgets/extract/extract", {
        wallet,
    });
};

export const extract = async (req, res) => {
    const extract = await Invoice.findAll({
        where: {
            wallet_id: req.body.wallet,
        },
        order: [["due_at", "DESC"]],
    });

    let dataInvest = FormatData.format(extract);
    let totalIncome = 0;
    let totalExpense = 0;

    extract.forEach((item) => {
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
    res.json(data);
};
