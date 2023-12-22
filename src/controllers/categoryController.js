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

// TODO separar acoes para cada endpoint confomre docs restapi
export const save = async (req, res) => {
    if (req.body.action && req.body.action === "create") {
        try {
            const categoryCreate = await prisma.app_categories.create({
                data: {
                    user_id: req.userSession.id,
                    name: req.body.name,
                    description: req.body.description,
                    type: req.body.type,
                },
            });

            res.json({ categoryCreate });
        } catch (err) {
            console.log(err);
            res.json({
                message: "Ooops, algo deu errado, contate o admin",
                type: "error",
            });
        } finally {
            await prisma.$disconnect();
        }
    }

    if (req.body.action && req.body.action === "update") {
        try {
            const categoryUpdate = await prisma.app_categories.update({
                where: {
                    id: parseInt(req.body.id),
                },
                data: {
                    name: req.body.name,
                    description: req.body.description,
                    type: req.body.type,
                },
            });

            res.json({ categoryUpdate });
        } catch (error) {
            console.log(error);
            res.json({
                message: "Ooops, algo deu errado, contate o admin",
                type: "error",
            });
        } finally {
            prisma.$disconnect();
        }
    }

    if (req.body.action && req.body.action === "delete") {
        try {
            const categoryDelete = await prisma.app_categories.delete({
                where: {
                    id: parseInt(req.body.id),
                },
            });

            res.json({
                message: "Registro removido com sucesso",
                type: "success",
                remove: true,
            });
            return;
        } catch (error) {
            console.log(error);
            res.json({
                message: "Ooops, algo deu errado, contate o admin",
                type: "error",
            });
        } finally {
            prisma.$disconnect();
        }
    }
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
