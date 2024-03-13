import { Request, Response } from "express";
import ReportModel from "../../models/reports/ReportModel";
import { dataReturn } from "../../helpers/functions.js";

export const categoryFlow = async (req: Request, res: Response) => {
    const report = await ReportModel.sumCategoryGroup("8", "income");
    res.json(dataReturn(report, "/report", ""));
};
