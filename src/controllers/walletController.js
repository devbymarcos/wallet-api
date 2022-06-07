import { Wallet } from "../models/Wallet.js";

export const wallet = async (req, res) => {
    const { id } = req.dataUser;
    let wallet = await Wallet.findAll({
        where: {
            user_id: id,
        },
    });

    res.json({
        wallet,
    });
};

export const save = async (req, res) => {
    const userSession = req.session.user;

    if (req.body.action && req.body.action === "create") {
        const wCreate = Wallet.build({
            user_id: userSession,
            name: req.body.name,
            description: req.body.description,
            option_wallet: req.body.prefwallet,
        });
        if (!(await wCreate.save())) {
            res.json({
                message: "Ooops, algo deu errado, contate o admin",
                type: "error",
            });
            return;
        }
        res.json({ redirect: "/carteira-editar?id=" + wCreate.id });
        return;
    }
    if (req.body.action && req.body.action === "update") {
        const wUpdate = await Wallet.update(
            {
                name: req.body.name,
                description: req.body.description,
                option_wallet: req.body.prefwallet,
            },
            {
                where: {
                    id: req.body.wallet_id,
                },
            }
        );
        if (!wUpdate) {
            res.json({
                message: "Ooops, algo deu errado, contate o admin",
                type: "error",
            });
            return;
        }
        res.json({ message: "Registro atualizado", type: "success" });
        return;
    }
    if (req.body.action && req.body.action === "delete") {
        const wDelete = await Wallet.destroy({
            where: {
                id: req.body.id,
            },
        });

        if (!wDelete) {
            res.json({
                message: "Ooops, algo deu errado, contate o admin",
                type: "error",
            });
            return;
        }
        res.json({ redirect: "/carteiras" });
        return;
    }
};
