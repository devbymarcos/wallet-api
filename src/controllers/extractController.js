import { prisma } from "../database/prismaClient.js";
import { formatDateView } from "../helpers/hooks.js";

export const extract = async (req, res) => {
    // formatar a date para o prisma

    const dateIni = req.body.date1;
    const dateEnd = req.body.date2;
    const wallet = req.body.wallet_id;

    const extractFilter = await prisma.$queryRaw`
    SELECT * FROM app_invoice WHERE due_at BETWEEN ${dateIni} AND ${dateEnd} AND wallet_id = ${wallet}  ORDER BY due_at DESC
    `;

    const extractData = extractFilter.map((item) => {
        let obj = {};

        obj.date = formatDateView(item.due_at);
        obj.description = item.description;
        obj.price = item.price;
        obj.status = item.pay;
        obj.id = item.id;
        obj.type = item.type;
        //formata status

        if (item.pay === "paid") {
            obj.status = true;
        } else {
            obj.status = false;
        }

        return obj;
    });

    console.log(extractData);

    let totalIncome = 0;
    let totalExpense = 0;

    extractFilter.forEach((item) => {
        if (item.type === "income" || item.type === "transf-income") {
            totalIncome += item.price;
        } else {
            totalExpense += item.price;
        }
    });
    const total = totalIncome - totalExpense;

    const data = {
        total: total,
        result: extractData,
    };
    res.json(data);
};
