import { Request, Response } from "express";
import { dataReturn } from "../../helpers/functions";
import RegisterCategory from "../../models/category/RegisterCategory";
import FindByIdCategory from "../../models/category/FindByIdCategory";
import RemoveCategory from "../../models/category/RemoveCategory";
import FindAllCategory from "../../models/category/FindAllCategory";
import UpdateCategory from "../../models/category/UpdateCategory";

export const categories = async (req: Request, res: Response) => {
    const categories = new FindAllCategory(res.locals.userAuth.id);
    const data = await categories.execute();
    res.json(dataReturn(data, "/category", ""));
};

export const category = async (req: Request, res: Response) => {
    const category = new FindByIdCategory(parseInt(req.params.id));
    const data = await category.execute();
    res.json(dataReturn([data], "category", ""));
};

export const create = async (req: Request, res: Response) => {
    const category = new RegisterCategory({
        user_id: res.locals.userAuth.id,
        name: req.body.name,
        description: req.body.description,
        type: req.body.type,
    });

    const data = await category.execute();
    res.json(dataReturn([data], "category", ""));
};

export const remove = async (req: Request, res: Response) => {
    const category = new RemoveCategory(parseInt(req.params.id));
    const data = await category.execute();
    res.json(dataReturn(data, "/category", ""));
};

export const update = async (req: Request, res: Response) => {
    //TODO VALIDA DADOS
    const category = new UpdateCategory({
        id: Number(req.body.id),
        name: req.body.name,
        description: req.body.description,
        type: req.body.type,
        user_id: res.locals.userAuth.id,
    });

    const data = await category.execute();
    res.json(dataReturn([data], "category", ""));
};
