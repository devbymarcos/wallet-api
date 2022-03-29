import { Category } from "../models/Category.js";
import { Invoice } from "../models/Invoice.js";
import { Wallet } from "../models/Wallet.js";

export const createInvest = async (req, res) => {
    const userSession = req.session.user;
    const userName = req.session.fullName;
    const wallet = await Wallet.findAll({
        where: {
            user_id: userSession,
        },
    });
    const categoryIcome = await Category.findAll({
        where: {
            user_id: userSession,
            type: "income",
        },
    });
    const categoryExpense = await Category.findAll({
        where: {
            user_id: userSession,
            type: "expense",
        },
    });
    res.render("pages/widgets/entreCarteira/entre-carteira", {
        wallet,
        categoryIcome,
        categoryExpense,
        userName,
    });
};

export const save = async (req, res) => {
    const userId = req.session.user;

    if (req.body.action && req.body.action === "create") {
        if (!req.body.description) {
            res.json({ message: "Preencha a descrição", type: "warning" });
            return;
        } else if (!req.body.price) {
            res.json({ message: "Preencha o valor", type: "warning" });
            return;
        } else if (!req.body.category_entry) {
            res.json({
                message: "Escolha a categoria entrada",
                type: "warning",
            });
            return;
        } else if (!req.body.category_exit) {
            res.json({
                message: "Escolha a categoria de saida",
                type: "warning",
            });
            return;
        } else if (!req.body.wallet_exit) {
            res.json({
                message: "Escolha a carteira de saída",
                type: "warning",
            });
            return;
        } else if (!req.body.wallet_entry) {
            res.json({
                message: "Escolha a carteira de entrada",
                type: "warning",
            });
            return;
        } else if (!req.body.date) {
            res.json({ message: "É necessario a data", type: "warning" });
            return;
        }

        //remove o ponto da mascara do input
        const priceReplace = req.body.price.replace(".", "");

        const transCreateDebito = await Invoice.create({
            user_id: userId,
            wallet_id: req.body.wallet_exit,
            category_id: req.body.category_exit,
            description: req.body.description,
            price: parseFloat(priceReplace.replace(",", ".")),
            due_at: req.body.date,
            type: "expense",
            pay: "paid",
            repeat_when: "single",
            period: !req.body.period ? "month" : req.body.period,
        });

        if (!transCreateDebito) {
            res.json({
                message: 'Ooops, algo deu errado, "DEBITO" contate o admin ',
                type: "error",
            });
            return;
        }

        const transCreateCredito = await Invoice.create({
            user_id: userId,
            wallet_id: req.body.wallet_entry,
            category_id: req.body.category_entry,
            description: req.body.description,
            price: parseFloat(priceReplace.replace(",", ".")),
            due_at: req.body.date,
            type: "income",
            pay: "paid",
            repeat_when: "single",
            period: !req.body.period ? "month" : req.body.period,
        });

        if (!transCreateCredito) {
            res.json({
                message: 'Ooops, algo deu errado, "CREDITO" contate o admin ',
                type: "error",
            });
            return;
        }

        res.json({
            message: "lançamento registrado",
            type: "success",
        });
    }
};
