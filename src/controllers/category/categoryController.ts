import { Request, Response } from "express";
import { dataReturn } from "../../helpers/functions";
import CategoryRegister from "../../models/category/CategoryRegister";
import CategoryFindById from "../../models/category/CategoryFindById";
import CategoryRemove from "../../models/category/CategoryRemove";
import CategoryFindAll from "../../models/category/CategoryFindAll";
import CategoryUpdate from "../../models/category/CategoryUpdate";

export const categories = async (req: Request, res: Response) => {
    const categories = new CategoryFindAll(res.locals.userAuth.id);
    const data = await categories.execute();
    res.json(dataReturn(data, "/category", ""));
};

export const category = async (req: Request, res: Response) => {
    const category = new CategoryFindById(parseInt(req.params.id));
    const data = await category.execute();
    res.json(dataReturn([data], "category", ""));
};

export const create = async (req: Request, res: Response) => {
    const category = new CategoryRegister({
        user_id: res.locals.userAuth.id,
        name: req.body.name,
        description: req.body.description,
        type: req.body.type,
    });

    const data = await category.execute();
    res.json(dataReturn([data], "category", ""));
};

export const remove = async (req: Request, res: Response) => {
    const category = new CategoryRemove(parseInt(req.params.id));
    const data = await category.execute();
    res.json(dataReturn(data, "/category", ""));
};

export const update = async (req: Request, res: Response) => {
    //TODO VALIDA DADOS
    const category = new CategoryUpdate({
        id: Number(req.body.id),
        name: req.body.name,
        description: req.body.description,
        type: req.body.type,
        user_id: res.locals.userAuth.id,
    });

    const data = await category.execute();
    res.json(dataReturn([data], "category", ""));
};
