import { dataReturn } from "../helpers/functions.js";
import Category from "../models/Category.js";

export const categories = async (req, res) => {
    const { id } = req.userAuth;
    const categoryObj = {
        user_id: id,
    };
    const categories = new Category(categoryObj);
    const data = await categories.findAll();
    res.json(dataReturn(data, "category"));
};
export const category = async (req, res) => {
    const categoryObj = {
        id: req.params.id,
    };
    const category = new Category(categoryObj);
    const data = await category.findById();

    res.json(dataReturn(data, "category"));
};

export const create = async (req, res) => {
    //TODO VALIDA DADOS
    const categoryObj = {
        user_id: req.userAuth.id,
        name: req.body.name,
        description: req.body.description,
        type: req.body.type,
    };

    const category = new Category(categoryObj);
    const data = await category.register();
    res.json(dataReturn(data, "category"));
};

export const remove = async (req, res) => {
    const categoryObj = {
        id: req.params.id,
    };
    const category = new Category(categoryObj);
    const data = await category.delete();

    res.json(dataReturn(data, "category"));
};

export const update = async (req, res) => {
    //TODO VALIDA DADOS
    const categoryObj = {
        id: req.body.id,
        name: req.body.name,
        description: req.body.description,
        type: req.body.type,
    };

    const category = new Category(categoryObj);
    const data = await category.update();

    res.json(dataReturn(data, "category"));
};
