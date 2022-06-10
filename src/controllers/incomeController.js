import { prisma } from "../database/prismaClient.js";
import { formatDateView } from "../helpers/hooks.js";

export const income = async (req, res) => {
    const { id } = req.dataUser;
    const data = new Date();

    let dateInput = req.query.date;
    let dateArr = "";
    if (dateInput) {
        dateArr = dateInput.split("-");
    }

    let due_month = dateArr[0] ? parseInt(dateArr[0]) : data.getMonth() + 1;
    let due_year = dateArr[1] ? parseInt(dateArr[1]) : data.getFullYear();

    const income = await prisma.$queryRaw`
        SELECT * FROM app_invoice WHERE user_id= ${id} AND type = "income" AND year(due_at) = ${due_year} AND month(due_at) = ${due_month} ORDER BY day(due_at)`;

    let dataIncome = [];
    income.forEach((item) => {
        // formata price
        let price = item.price.toLocaleString("pt-br", {
            style: "currency",
            currency: "BRL",
        });
        //formata status
        let statusPay = "";
        if (item.pay === "paid") {
            statusPay = true;
        } else {
            statusPay = false;
        }
        //cria novo objto com dados formatado
        dataIncome.push({
            id: item.id,
            date: formatDateView(item.due_at),
            description: item.description,
            status: statusPay,
            value: price,
        });
    });
    console.log(income);
    res.json({ dataIncome });
};

// export const save = async (req, res) => {
//     const id = req.session.user;

//     if (req.body.action && req.body.action === "create") {
//         if (!req.body.description) {
//             res.json({ message: "Preencha a descrição", type: "warning" });
//             return;
//         } else if (!req.body.price) {
//             res.json({ message: "Preencha o valor", type: "warning" });
//             return;
//         } else if (!req.body.category) {
//             res.json({ message: "Escolha a categoria", type: "warning" });
//             return;
//         } else if (!req.body.wallet) {
//             res.json({ message: "Escolha a carteira", type: "warning" });
//             return;
//         } else if (!req.body.date) {
//             res.json({ message: "É necessario a data", type: "warning" });
//             return;
//         }
//         //remove o ponto da mascara do input
//         const priceReplace = req.body.price.replace(".", "");
//         if (req.body.repeat_when === "installments") {
//             const date = req.body.date;
//             const dateArr1 = date.split("-");
//             const [year, month, day] = dateArr1.map(Number);

//             const data = new Date(year, month - 1, day);
//             let dataDb = "";
//             let dia = "";
//             let mes = "";
//             let ano = "";
//             let p = 0;

//             for (let i = 0; i < req.body.installments; i++) {
//                 p++;
//                 if (i === 0) {
//                     data.setMonth(data.getMonth());
//                 } else {
//                     data.setMonth(data.getMonth() + 1);
//                 }

//                 dia = data.getDate();
//                 mes = data.getMonth() + 1;
//                 ano = data.getFullYear();
//                 dataDb = ano + "-" + mes + "-" + dia;

//                 const expenseCreate = await Invoice.create({
//                     user_id: id,
//                     wallet_id: req.body.wallet,
//                     category_id: req.body.category,
//                     description:
//                         req.body.description +
//                         " parcela " +
//                         p +
//                         "/" +
//                         req.body.installments,
//                     price: parseFloat(priceReplace.replace(",", ".")),
//                     due_at: dataDb,
//                     type: req.body.type,
//                     repeat_when: req.body.repeat_when,
//                 });
//             }

//             res.json({ redirect: "/receitas" });
//             return;
//         }
//         //end parcelado

//         const incomeCreate = Invoice.build({
//             user_id: id,
//             wallet_id: req.body.wallet,
//             category_id: req.body.category,
//             description: req.body.description,
//             price: parseFloat(priceReplace.replace(",", ".")),
//             due_at: req.body.date,
//             type:
//                 req.body.repeat_when === "fixed"
//                     ? "fixed_" + req.body.type
//                     : req.body.type,
//             pay: req.body.repeat_when === "fixed" ? "paid" : "unpaid",
//             repeat_when: req.body.repeat_when,
//             period: !req.body.period ? "month" : req.body.period,
//         });

//         await incomeCreate.save().catch((err) => {
//             console.log("linha:", err);
//             res.json({
//                 message: "Ooops, algo deu errado, contate o admin",
//                 type: "error",
//             });
//             return;
//         });

//         res.json({ redirect: "/receita-edit?id=" + incomeCreate.id });
//         return;
//     }
//     if (req.body.action && req.body.action === "update") {
//         if (req.body.acao === "flash_list") {
//             const incomeUpdate = await Invoice.update(
//                 {
//                     pay: req.body.pay,
//                 },
//                 {
//                     where: {
//                         id: req.body.id,
//                     },
//                 }
//             );
//             if (!incomeUpdate) {
//                 res.json({
//                     message: "Ooops, algo deu errado, contate o admin",
//                     type: "error",
//                 });
//                 return;
//             }

//             res.json({ message: "Registro Atualizado", type: "success" });
//         } else {
//             if (!req.body.description) {
//                 res.json({ message: "Preencha a descrição", type: "warning" });
//                 return;
//             } else if (!req.body.price) {
//                 res.json({ message: "Preencha o valor", type: "warning" });
//                 return;
//             } else if (!req.body.category) {
//                 res.json({ message: "Escolha a categoria", type: "warning" });
//             } else if (!req.body.wallet) {
//                 res.json({ message: "Escolha a carteira", type: "warning" });
//             } else if (!req.body.date) {
//                 res.json({ message: "É necessario a data", type: "warning" });
//             }
//             //remove o ponto da mascara do input
//             const priceReplace = req.body.price.replace(".", "");
//             const incomeUpdate = await Invoice.update(
//                 {
//                     wallet_id: req.body.wallet,
//                     category_id: req.body.category,
//                     description: req.body.description,
//                     price: parseFloat(priceReplace.replace(",", ".")),
//                     due_at: req.body.date,
//                     type: "income",
//                     pay: req.body.pay,
//                     repeat_when: req.body.repeat_when,
//                     period: !req.body.period ? "month" : req.body.period,
//                 },
//                 {
//                     where: {
//                         id: req.body.id,
//                     },
//                 }
//             );

//             if (!incomeUpdate) {
//                 res.json({
//                     message: "Ooops, algo deu errado, contate o admin",
//                     type: "error",
//                 });
//                 return;
//             }

//             res.json({ message: "Registro Atualizado", type: "success" });
//         }
//     }

//     if (req.body.action && req.body.action === "delete") {
//         const incomeDelete = await Invoice.destroy({
//             where: {
//                 id: req.body.id,
//             },
//         });

//         if (!incomeDelete) {
//             res.json({
//                 message: "Ooops, algo deu errado, contate o admin",
//                 type: "error",
//             });
//             return;
//         }
//         res.json({ redirect: "/receitas" });
//         return;
//     }
// };
