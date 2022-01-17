import { Invoice } from "../models/Invoice.js";

export const create = async (req, res) => {
    const invest = await Invoice.findAll({
        where: {
            user_id: req.session.user,
            wallet_id: 26,
        },
        order: [["due_at", "DESC"]],
    });

    let dataInvest = [];
    invest.forEach((item) => {
        //formata data
        let dateArr = item.due_at.split("-");
        let [year, month, day] = dateArr.map(Number);

        let date = new Date(year, month - 1, day);
        let dateFormat =
            date.getDate() +
            "/" +
            (date.getMonth() + 1) +
            "/" +
            date.getFullYear();

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
        dataInvest.push({
            id: item.id,
            date: dateFormat,
            description: item.description,
            status: statusPay,
            value: price,
            type: item.type,
        });
    });
    res.render("pages/widgets/investment/investment", {
        dataInvest,
    });
};
