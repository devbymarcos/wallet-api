import { prisma } from "../database/prismaClient.js";

export const save = async (req, res) => {
    const { id } = req.userSession;
    const d = new Date(req.body.date);
    const day = d.getUTCDate();
    const year = d.getUTCFullYear();
    const month = d.getUTCMonth();

    try {
        const transCreateDebito = await prisma.app_invoice.create({
            data: {
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
            },
        });

        const transCreateCredito = await prisma.app_invoice.create({
            data: {
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
            },
        });
        if (transCreateDebito.id && transCreateCredito.id) {
            res.json({
                message: "Transferecia realizada",
                type: "success",
            });
        }
    } catch (err) {
        console.log(err);
        res.json({ messagem: "Oops algo deu errado contate o admin" });
    } finally {
        prisma.$disconnect();
    }
};
