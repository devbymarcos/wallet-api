import { prisma } from "../database/prismaClient.js";
import Category from "../models/Category.js";

export const categories = async (req, res) => {
    const { id } = req.userAuth;
    const categoryObj = {
        user_id: id,
    };
    const categories = new Category(categoryObj);
    const data = await categories.findAll();

    if (!data) {
        res.json({ message: "Algo aconteceu contate o admin" });
    }
    if (data.length <= 0) {
        res.json({
            data: null,
            message: "não encontramos dados",
            request: "category",
        });
    }

    res.json({
        data: data,
        message: "",
        request: "category",
    });
};
export const category = async (req, res) => {
    const categoryObj = {
        id: req.params.id,
    };
    const category = new Category(categoryObj);
    const data = await category.findById();

    if (!data) {
        res.json({ message: "Algo aconteceu contate o admin" });
    }
    if (data.length <= 0) {
        res.json({
            data: null,
            message: "não encontramos dados",
            request: "category",
        });
    }

    res.json({
        data: data,
        message: "",
        request: "category",
    });
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
    if (!data) {
        res.json({
            data: data,
            message: "Algo aconteceu contate admin",
            request: "category",
        });
    }

    res.json({
        data: data,
        message: "",
        request: "category",
    });
};

export const remove = async (req, res) => {
    const categoryObj = {
        id: req.params.id,
    };
    const category = new Category(categoryObj);
    const data = await category.delete();

    if (!data) {
        res.json({
            data: data,
            message: "Algo aconteceu contate admin",
            request: "category",
        });
    }

    res.json({
        data: data,
        message: "ok removido",
        request: "category",
    });
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

    if (!data) {
        res.json({
            data: data,
            message: "Algo aconteceu contate admin",
            request: "category",
        });
    }

    res.json({
        data: data,
        message: "",
        request: "category",
    });
};
