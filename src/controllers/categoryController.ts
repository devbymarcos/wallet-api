import { Request, Response } from "express";
import { dataReturn } from "../helpers/functions.js";
import Category from "../models/Category.js";

export const categories = async (req: Request, res: Response) => {
    const categoryObj = {
        user_id: res.locals.userAuth.id,
    };
    const categories = new Category(categoryObj);
    const data = await categories.findAll();
    res.json(dataReturn(data, "/category", ""));
};

export const category = async (req: Request, res: Response) => {
    const categoryObj = {
        id: parseInt(req.params.id),
    };
    const category = new Category(categoryObj);
    const data = await category.findById();

    res.json(dataReturn([data], "category", ""));
};

export const create = async (req: Request, res: Response) => {
    //TODO VALIDA DADOS
    const categoryObj = {
        user_id: res.locals.userAuth.id,
        name: req.body.name,
        description: req.body.description,
        type: req.body.type,
    };

    const category = new Category(categoryObj);
    const data = await category.register();
    res.json(dataReturn([data], "category", ""));
};

export const remove = async (req: Request, res: Response) => {
    const categoryObj = {
        id: parseInt(req.params.id),
    };
    const category = new Category(categoryObj);
    const data = await category.delete();

    res.json(dataReturn(data, "/category", ""));
};

export const update = async (req: Request, res: Response) => {
    //TODO VALIDA DADOS

    const categoryObj = {
        id: Number(req.body.id),
        name: req.body.name,
        description: req.body.description,
        type: req.body.type,
    };

    const category = new Category(categoryObj);
    const data = await category.update();

    res.json(dataReturn([data], "category", ""));
};
