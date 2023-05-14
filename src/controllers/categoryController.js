import { prisma } from "../database/prismaClient.js";

export const category = async (req, res) => {
    const { id } = req.userSession;

    try {
        let categories = await prisma.app_categories.findMany({
            where: {
                user_id: id,
            },
        });
        let category = categories.map((item) => {
            let obj = {};
            obj.id = item.id;
            obj.user_id = item.user_id;
            obj.name = item.name;
            obj.description = item.description;
            if (item.type === "expense") {
                obj.type = "Despesas";
            } else {
                obj.type = "Receita";
            }
            return obj;
        });
        res.json({
            category,
        });
    } catch (err) {
        console.log(err);
    } finally {
        await prisma.$disconnect();
    }
};

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

            res.json({ message: "registro criado", id: categoryCreate.id });
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
                    id: req.body.category_id,
                },
                data: {
                    name: req.body.name,
                    description: req.body.description,
                    type: req.body.type,
                },
            });

            res.json({ message: "Registro atualizado", type: "success" });
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
                    id: req.body.id,
                },
            });

            res.json({
                message: "Registro removido com sucesso",
                type: "success",
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

export const categoryUniq = async (req, res) => {
    try {
        const category = await prisma.app_categories.findUnique({
            where: {
                id: parseInt(req.params.id),
            },
        });

        if (category.id) {
            res.json(category);
            return;
        }
    } catch (err) {
        console.log(err);
        res.json({ message: "Oops tivemos um erro contate o admin" });
    } finally {
        prisma.$disconnect();
    }
};
