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
            const categoryUpdate = prisma.app_categories.update(
                {
                    where: {
                        id: req.body.category_id,
                    },
                },
                {
                    name: req.body.name,
                    description: req.body.description,
                    type: req.body.type,
                }
            );

            res.json({ message: "Registro atualizado", type: "success" });
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

    if (req.body.action && req.body.action === "delete") {
        try {
            const categoryDelete = prisma.app_categories.delete({
                where: {
                    id: req.body.id,
                },
            });
            if (!categoryDelete.id) {
                res.json({
                    message: "Ooops, algo deu errado, contate o admin",
                    type: "error",
                });
                return;
            }
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
