import { prisma } from "../database/prismaClient.js";

export const invoiceFixedList = async (req, res) => {
    const { id } = req.userSession;

    try {
        const fixed = await prisma.app_invoice.findMany({
            where: {
                user_id: id,
                type: { in: ["fixed_income", "fixed_expense"] },
            },
        });

        const newFixed = fixed.map((item) => {
            const obj = {};
            const date = new Date(item.due_at);
            //formata status
            let statusPay = "";
            if (item.pay === "paid") {
                statusPay = true;
            } else {
                statusPay = false;
            }
            obj.id = item.id;
            obj.due_at =
                date.getUTCDate() < 10
                    ? "Dia 0" + date.getUTCDate()
                    : "Dia " + date.getUTCDate();
            obj.description =
                item.type === "fixed_income"
                    ? "Receita / " + item.description
                    : "Despesa / " + item.description;
            obj.price =
                item.price.toLocaleString("pt-br", {
                    style: "currency",
                    currency: "BRL",
                }) + " /mês";
            obj.status = statusPay;
            obj.type = item.type;
            return obj;
        });

        res.json(newFixed);
    } catch (err) {
        console.log(err);
    } finally {
        prisma.$disconnect();
    }
};
export const invoiceFixedEdit = async (req, res) => {
    const userId = req.session.user;
    const userName = req.session.fullName;
    const invoice = await Invoice.findByPk(req.query.id);
    const wallet = await Wallet.findAll({
        where: {
            user_id: userId,
        },
    });
    const category = await Category.findAll({
        where: {
            user_id: userId,
        },
    });

    const select = (type, value) => {
        return type == value ? "selected" : "";
    };
    const setWallet = [];
    wallet.forEach((wal) => {
        setWallet.push({
            id: wal.id,
            name: wal.name,
            selAttr: select(wal.id, invoice.wallet_id),
        });
    });
    const setCategory = [];
    category.forEach((cate) => {
        setCategory.push({
            id: cate.id,
            name: cate.name,
            selAttr: select(cate.id, invoice.category_id),
        });
    });

    const selUnpaid = select(invoice.pay, "unpaid");
    const selPaid = select(invoice.pay, "paid");

    console.log(selPaid);
    const classe =
        invoice.type === "fixed_income" ? "text-color-green" : "text-color-red";
    const typeName = invoice.type == "fixed_income" ? " RECEITA" : " DESPESA";
    const priceBr = invoice.price.toFixed("2").replace(".", ",");

    res.render("pages/widgets/invoice-fixed/fixed-edit", {
        invoice,
        classe,
        typeName,
        priceBr,
        setWallet,
        setCategory,
        status: { selUnpaid, selPaid },
        userName,
    });
};

// export const fixedUpdate = (req,res)=>{

//   let value = parseFloat(req.body.price.replace(',','.'));

//   const fixedUpdate = Invoice.update({
//     wallet_id:req.body.wallet,
//     category_id:req.body.category,
//     description:req.body.description,
//     price:value,
//     due_at:req.body.date,
//     pay:req.body.pay
//   },{
//     where:{
//       id:req.body.fixed_id
//     }
//   })

//   if(!fixedUpdate){
//     res.json({message:"Ooops, algo deu errado, contate o admin",type:'error'})
//       return
//   }
//   res.json({message:"Registro atualizado",type:'success'})
//   return

// }

// export const fixedDelete = (req,res)=>{

//     const fixedDelete  = Invoice.destroy({
//         where:{
//             id:req.body.id
//         }
//     })
//     if(!fixedDelete){
//         res.json({message:"Ooops, algo deu errado, contate o admin",type:'error'})
//     return
//     }
//     res.json({redirect:"/fixo"})
//     return

// }

export const autoFixedCreate = async (req, res) => {
    const { id } = req.userSession;

    const invoice = await prisma.app_invoice.findMany({
        where: {
            user_id: id,
            type: {
                in: ["fixed_income", "fixed_expense"],
            },
            pay: "paid",
        },
    });

    if (invoice.length < 1) {
        next();
        return;
    }

    let invoiceId = "";
    let currentDate = new Date();
    let data = [];
    for (const itemfixed of invoice) {
        invoiceId = itemfixed.id;
        const d = new Date(itemfixed.due_at);
        const fixedSearch =
            await prisma.$queryRaw`SELECT *  FROM app_invoice WHERE  user_id = ${id}  AND invoice_of = ${invoiceId} AND month(due_at) = ${
                currentDate.getMonth() + 1
            } AND year(due_at) = ${currentDate.getFullYear()} `;

        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const day = d.getUTCDate();

        if (fixedSearch.length < 1) {
            data.push({
                user_id: itemfixed.user_id,
                name: "",
                wallet_id: itemfixed.wallet_id,
                category_id: itemfixed.category_id,
                invoice_of: invoiceId,
                description: itemfixed.description,
                price: itemfixed.price,
                due_at: new Date(year, month, day),
                type: itemfixed.type.replace("fixed_", ""),
                pay: "unpaid",
                repeat_when: "fixed",
                period: itemfixed.period,
            });
        }
    }

    if (data.length < 1) {
        res.json({ message: "Contas Fixas Ok" });
        return;
    }

    try {
        const invoiceCreate = await prisma.app_invoice.createMany({
            data,
        });

        res.json({ message: "Lançada contas fixas" });
    } catch (error) {
        console.log(error);
    }
};
