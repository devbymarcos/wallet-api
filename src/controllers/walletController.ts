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
        return;
    }

    res.json({ wallets });
};

export const walletCreate = async (req, res) => {
    const { id } = req.userSession;

    try {
        const wallet = await prisma.app_wallet.create({
            data: {
                user_id: id,
                name: req.body.name,
                description: req.body.description,
                option_wallet: parseInt(req.body.prefWallet),
            },
        });

        res.json({ wallet });
    } catch (err) {
        console.log(err);
        res.json({
            message: "Ooops, algo deu errado, contate o admin",
            type: "error",
        });
    } finally {
        await prisma.$disconnect();
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

export const walletUpdate = async (req, res) => {
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
};

export const walletDelete = async (req, res) => {
    try {
        const wallet = await prisma.app_wallet.delete({
            where: {
                id: req.body.id,
            },
        });
        if (wallet.id)
            return res.json({ message: "Carteira removida", remove: true });
    } catch (err) {
        console.log(err);
        res.json({
            message: "não foi possivel excluir o registro contate o admin",
        });
    } finally {
        await prisma.$disconnect();
    }
};
