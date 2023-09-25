import { prisma } from "../database/prismaClient.js";

export const wallet = async (req, res) => {
    const { id } = req.userSession;
    let wallets = await prisma.app_wallet.findMany({
        where: {
            user_id: id,
        },
    });

    if (!wallets.length > 0) {
        res.json({ message: "Não existe dados" });
    }

    res.json({ wallets });
};

export const save = async (req, res) => {
    const { id, email } = req.userSession;

    if (req.body.action && req.body.action === "create") {
        try {
            const wCreate = await prisma.app_wallet.create({
                data: {
                    user_id: id,
                    name: req.body.name,
                    description: req.body.description,
                    option_wallet: parseInt(req.body.prefWallet),
                },
            });

            res.json({ wCreate });
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
        console.log(req.body.wallet_id);
        try {
            const wUpdate = await prisma.app_wallet.update({
                where: {
                    id: parseInt(req.body.wallet_id),
                },
                data: {
                    name: req.body.name,
                    description: req.body.description,
                    option_wallet: parseInt(req.body.prefWallet),
                },
            });

            if (wUpdate.id) {
                res.json({
                    id: wUpdate.id,
                    message: "Registro atualizado",
                    type: "success",
                });
            }
        } catch (err) {
            console.log(err);
            res.json({
                message: "Não foi possivel atualizar contate o admin",
                type: "error",
            });
        } finally {
            await prisma.$disconnect();
        }
    }
    if (req.body.action && req.body.action === "delete") {
        try {
            const wDelete = await prisma.app_wallet.delete({
                where: {
                    id: req.body.id,
                },
            });
            if (wDelete.id)
                return res.json({ message: "Carteira removida", remove: true });
        } catch (err) {
            console.log(err);
            res.json({
                message: "não foi possivel excluir o registro contate o admin",
            });
        } finally {
            await prisma.$disconnect();
        }
    }
};

export const walletUniq = async (req, res) => {
    const { id } = req.userSession;

    try {
        const wallet = await prisma.app_wallet.findUnique({
            where: {
                id: parseInt(req.params.id),
            },
        });

        if (wallet.id) {
            res.json({ wallet });
            return;
        }
    } catch (err) {
        console.log(err);
        res.json({ message: "Oops tivemos um erro contate o admin" });
    } finally {
        prisma.$disconnect();
    }
};
