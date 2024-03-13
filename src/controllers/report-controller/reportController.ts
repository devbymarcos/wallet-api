import { Request, Response } from "express";
import ReportModel from "../../models/reports/ReportModel";
import { dataReturn } from "../../helpers/functions.js";

export const cashFlowOnCategory = async (req: Request, res: Response) => {
    const [income, expense] = await Promise.all([
        ReportModel.sumCategoryGroup("8", "income"),
        ReportModel.sumCategoryGroup("8", "expense"),
    ]);

    const dataReport = {
        income: income,
        expense: expense,
    };
    res.json(dataReturn(dataReport, "/report", ""));
    //TODO CONTINUAR AQUI
};
