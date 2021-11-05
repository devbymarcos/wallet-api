import { Invoice } from '../models/Invoice.js';
import { sequelize } from '../instances/mysql.js';
import pkg from 'sequelize';
const { Sequelize, QueryTypes } = pkg;


export const createFixed = async (req,res,next)=>{
    const Op = Sequelize.Op;
    const userSession = 1 // req.session.user

    const invoice = await Invoice.findAll({
        where:{
            user_id:userSession,
            type:{
                [Op.in]: ['fixed_income', 'fixed_expense'],
            },
            pay:'paid'
        }
    })

    if(invoice.length < 1){
        next();
        return;
    }

    let invoiceId = '';
    let currentDate = new Date();
    let dateInvoice = '';
    let dateInvoiceMap ='';
    let newDate =''
    for(const itemfixed of invoice){
        
        invoiceId = itemfixed.id;
       
        const [year,month,day] = itemfixed.due_at.split('-').map(Number)
       
        const fixedSearch = await  sequelize.query("SELECT *  FROM app_invoice WHERE  user_id = :userId  AND invoice_of = :of AND month(due_at) = :mes", {replacements:{userId:userSession,mes:currentDate.getMonth()+1,of:invoiceId},
        type:QueryTypes.SELECT 
        })
       
        if(fixedSearch.length < 1 ){
            
            const invoiceCreate = await Invoice.create({
                user_id:itemfixed.user_id,
                wallet_id:itemfixed.wallet_id,
                category_id:itemfixed.category_id,
                invoice_of:invoiceId,
                description:itemfixed.description,
                price:itemfixed.price,
                due_at:currentDate.getFullYear()+'-'+(currentDate.getMonth()+1)+'-'+day,
                type:itemfixed.type.replace('fixed_',''),
                pay:'unpaid',
                repeat_when:'fixed',
                period:itemfixed.period
            })
       
        }

        

    }
    

    next();



}