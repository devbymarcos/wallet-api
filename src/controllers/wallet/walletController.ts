import { Request, Response } from "express";
import { dataReturn } from "../../helpers/functions.js";
import Wallet from "../../models/wallet-model/Wallet.js";

export const wallets = async (req: Request, res: Response) => {
    const wallet = new Wallet({
        user_id: res.locals.userAuth.id,
    });
    const data = await wallet.findyAll();
    res.json(dataReturn(data, "wallet"));
};

export const walletCreate = async (req: Request, res: Response) => {
    const wallet = new Wallet({
        user_id: res.locals.userAuth.id,
        name: req.body.name,
        description: req.body.description,
        option_wallet: parseInt(req.body.option_wallet),
    });
    const data = await wallet.register();
    res.json(dataReturn(data, "wallet"));
};

export const walletUniq = async (req: Request, res: Response) => {
    const wallet = new Wallet({
        id: parseInt(req.params.id),
        user_id: res.locals.userAuth.id,
    });
    const data = await wallet.findyById();
    res.json(dataReturn(data, "wallet"));
};

export const walletUpdate = async (req: Request, res: Response) => {
    const wallet = new Wallet({
        id: parseInt(req.body.id),
        name: req.body.name,
        description: req.body.description,
        option_wallet: parseInt(req.body.option_wallet),
    });
    const data = await wallet.update();
    res.json(dataReturn([data], "wallet"));
};

export const walletDelete = async (req: Request, res: Response) => {
    const wallet = new Wallet({
        id: parseInt(req.params.id),
    });
    const data = await wallet.remove();
    res.json(dataReturn(data, "wallet", "item removido"));
};

export const walletBalance = async (req: Request, res: Response) => {
    const wallet = new Wallet({
        user_id: res.locals.userAuth.id,
    });
    const data = await wallet.getWalletBalance();

    res.json(dataReturn(data, "wallet"));
};
