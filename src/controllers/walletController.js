import { prisma } from "../database/prismaClient.js";

export const wallet = async (req, res) => {
    const { id } = req.userSession;
    let wallet = await prisma.app_wallet.findMany({
        where: {
            user_id: id,
        },
    });

    res.json({
        wallet,
    });
};

export const save = async (req, res) => {
    const { id, email } = req.userSession;

    if (req.body.action && req.body.action === "create") {
        try {
            const wCreate = await prisma.app_wallet.create({
                data: {
                    user_id: userSession,
                    name: req.body.name,
                    description: req.body.description,
                    option_wallet: req.body.prefwallet,
                },
            });
            res.json({ message: "registro criado", id: wCreate.id });
        } catch (err) {
            console.log(err);
            res.json({
                message: "Ooops, algo deu errado, contate o admin",
                type: "error",
            });
        } finally {
            await prisma.$disconnect();
        }
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
