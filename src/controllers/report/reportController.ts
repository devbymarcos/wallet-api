import { Request, Response } from "express";
import ReportModel from "../../models/report-model/ReportModel";
import { dataReturn } from "../../helpers/functions.js";

export const cashFlowOnCategory = async (req: Request, res: Response) => {
    const wallet_id:string = String(req.query.walletId)
    const [income, expense] = await Promise.all([
        ReportModel.sumCategoryGroup(wallet_id, "income"),
        ReportModel.sumCategoryGroup(wallet_id, "expense"),
    ]);

    const dataReport = {
        income: income,
        expense: expense,
    };
    res.json(dataReturn(dataReport, "/report", ""));
    //TODO CONTINUAR AQUI
};
