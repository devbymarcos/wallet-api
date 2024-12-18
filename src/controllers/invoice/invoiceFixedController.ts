import { Request, Response } from "express";
import { prisma } from "../../database/prismaClient.js";
import { FixedListAll } from "../../models/invoice-model/FixedListAll.js";
import { FixedCreate } from "../../models/invoice-model/FixedCreate.js";
import { FixedGenerateInvoice } from "../../models/invoice-model/FixedGenerateInvoice.js";

export const listAll = async (req: Request, res: Response) => {
    const fixedList = new FixedListAll({
        user_id: res.locals.userAuth.id,
        wallet_id: Number(req.query.wallet_id),
    });

    const dataResponse = await fixedList.execute();
    console.log(dataResponse);
    res.json(dataResponse);
};

export const create = async (req: Request, res: Response) => {
    //validar as informaçoes recebidas
    const fixedCreate = new FixedCreate({
        user_id: Number(res.locals.userAuth.id),
        category_id: Number(req.body.category_id),
        due_at: new Date(req.body.due_at),
        wallet_id: Number(req.body.wallet_id),
        description: req.body.description,
        type: req.body.type,
        price: Number(req.body.price),
    });
    const response = await fixedCreate.execute();
    console.log(response);
    if (response?.id) {
        res.json(response);
        return;
    }

    res.json({ message: "Could not create" });
};

export const fixedGeneratePoint = async (req: Request, res: Response) => {
    const invoiceFixed = new FixedGenerateInvoice({
        user_id: Number(res.locals.userAuth.id),
        wallet_id: req.body.wallet_id,
    });
    invoiceFixed.execute();
};
