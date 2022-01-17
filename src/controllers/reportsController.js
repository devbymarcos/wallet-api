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

    res.render("pages/widgets/reports/reports", {
        dataInvest,
    });
};
