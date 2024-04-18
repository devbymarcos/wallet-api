import { Request, Response } from "express";
import { dataReturn } from "../../helpers/functions.js";
import Category from "../../models/category-model/Category.js";

export const categories = async (req: Request, res: Response) => {
    const categories = new Category();
    categories.user_id = res.locals.userAuth.id;

    const data = await categories.findAll();
    res.json(dataReturn(data, "/category", ""));
};

export const category = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const category = new Category(id);
    const data = await category.findById();

    res.json(dataReturn([data], "category", ""));
};

export const create = async (req: Request, res: Response) => {
    const category = new Category();
    category.user_id = res.locals.userAuth.id;
    category.name = req.body.name;
    category.description = req.body.description;
    category.type = req.body.type;
    const data = await category.register();
    res.json(dataReturn([data], "category", ""));
};

export const remove = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const category = new Category(id);
    const data = await category.delete();

    res.json(dataReturn(data, "/category", ""));
};

export const update = async (req: Request, res: Response) => {
    //TODO VALIDA DADOS

    const category = new Category();

    category.id = Number(req.body.id);
    category.name = req.body.name;
    category.description = req.body.description;
    category.type = req.body.type;

    const data = await category.update();

    res.json(dataReturn([data], "category", ""));
};
