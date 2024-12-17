import { Request, Response } from "express";
import { prisma } from "../../database/prismaClient.js";
import { FixedListAll } from "../../models/invoice-model/FixedListAll.js";
import { FixedCreate } from "../../models/invoice-model/FixedCreate.js";

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

// export const autoFixedCreate = async (req, res) => {
//     const { id } = req.userSession;

//     const invoice = await prisma.app_invoice.findMany({
//         where: {
//             user_id: id,
//             type: {
//                 in: ["fixed_income", "fixed_expense"],
//             },
//             pay: "paid",
//         },
//     });

//     if (invoice.length < 1) {
//         next();
//         return;
//     }

//     let invoiceId = "";
//     let currentDate = new Date();
//     let data = [];
//     for (const itemfixed of invoice) {
//         invoiceId = itemfixed.id;
//         const d = new Date(itemfixed.due_at);
//         const fixedSearch =
//             await prisma.$queryRaw`SELECT *  FROM app_invoice WHERE  user_id = ${id}  AND invoice_of = ${invoiceId} AND month(due_at) = ${
//                 currentDate.getMonth() + 1
//             } AND year(due_at) = ${currentDate.getFullYear()} `;

//         const year = currentDate.getFullYear();
//         const month = currentDate.getMonth();
//         const day = d.getUTCDate();

//         if (fixedSearch.length < 1) {
//             data.push({
//                 user_id: itemfixed.user_id,
//                 name: "",
//                 wallet_id: itemfixed.wallet_id,
//                 category_id: itemfixed.category_id,
//                 invoice_of: invoiceId,
//                 description: itemfixed.description,
//                 price: itemfixed.price,
//                 due_at: new Date(year, month, day),
//                 type: itemfixed.type.replace("fixed_", ""),
//                 pay: "unpaid",
//                 repeat_when: "fixed",
//                 period: itemfixed.period,
//             });
//         }
//     }

//     if (data.length < 1) {
//         res.json({ message: "Contas Fixas Ok" });
//         return;
//     }

//     try {
//         const invoiceCreate = await prisma.app_invoice.createMany({
//             data,
//         });

//         res.json({ message: "Lançada contas fixas" });
//     } catch (error) {
//         console.log(error);
//     }
// };
