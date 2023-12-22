import { prisma } from "../database/prismaClient.js";
import Wallet from "../models/Wallet.js";

export const wallets = async (req, res) => {
    const { id } = req.userAuth;
    const data = {
        user_id: id,
    };
    const wallet = new Wallet(data);
    const wallets = await wallet.findyAll();
    res.json({ data: wallets, message: "", request: "wallet" });
};

export const walletCreate = async (req, res) => {
    const { id } = req.userAuth;

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
    const { id } = req.userAuth;
    const dataParam = {
        id: req.params.id,
        user_id: id,
    };
    const walletModel = new Wallet(dataParam);
    const wallet = await walletModel.findyById();
    if (!wallet) {
        res.json({
            message: "Não econstramos a wallet solicitada",
            data: null,
        });
        return;
    }

    res.json({ data: wallet, message: "", request: "wallet" });
};
//TODO wallet-api #15
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
//TODO wallet-api #16
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
