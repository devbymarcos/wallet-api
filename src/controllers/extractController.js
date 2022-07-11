import { prisma } from "../database/prismaClient.js";

export const extract = async (req, res) => {
    const extractFilter = await prisma.app_invoice.findMany({
        where: {
            wallet_id: req.body.wallet,
            due_at: {
                lte: req.body.date1,
                gte: req.body.date2,
            },
        },
        orderBy: { due_at: "desc" },
    });
    console.log(extractFilter);
    // let dataInvest = FormatData.format(extract);
    // let totalIncome = 0;
    // let totalExpense = 0;

    // extract.forEach((item) => {
    //     if (item.type === "income") {
    //         totalIncome += item.price;
    //     } else {
    //         totalExpense += item.price;
    //     }
    // });
    // const total = totalIncome - totalExpense;

    // const data = {
    //     total: total,
    //     result: dataInvest,
    // };
    // res.json(data);
};
