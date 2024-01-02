import { Request, Response } from "express";
import { dataReturn } from "../helpers/functions.js";
import Category from "../models/Category.js";

interface CustomRequest extends Request {
    userAuth: {
        id: number;
    };
}

export const categories = async (req: CustomRequest, res: Response) => {
    const categoryObj = {
        user_id: req.userAuth.id,
    };
    const categories = new Category(categoryObj);
    const data = await categories.findAll();
    res.json(dataReturn(data, "category", ""));
};
export const category = async (req: CustomRequest, res: Response) => {
    const categoryObj = {
        id: parseInt(req.params.id),
    };
    const category = new Category(categoryObj);
    const data = await category.findById();

    res.json(dataReturn(data, "category", ""));
};

export const create = async (req: CustomRequest, res: Response) => {
    //TODO VALIDA DADOS
    const categoryObj = {
        user_id: req.userAuth.id,
        name: req.body.name,
        description: req.body.description,
        type: req.body.type,
    };

    const category = new Category(categoryObj);
    const data = await category.register();
    res.json(dataReturn(data, "category", ""));
};

export const remove = async (req: CustomRequest, res: Response) => {
    const categoryObj = {
        id: parseInt(req.params.id),
    };
    const category = new Category(categoryObj);
    const data = await category.delete();

    res.json(dataReturn(data, "/category", ""));
};

export const update = async (req: CustomRequest, res: Response) => {
    //TODO VALIDA DADOS
    const categoryObj = {
        id: req.body.id,
        name: req.body.name,
        description: req.body.description,
        type: req.body.type,
    };

    const category = new Category(categoryObj);
    const data = await category.update();

    res.json(dataReturn(data, "category", ""));
};
