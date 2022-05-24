import { Category } from "../models/Category.js";

export const category = async (req, res) => {
    let categories = await Category.findAll({
        where: {
            user_id: "1",
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
};

export const save = async (req, res) => {
    if (req.body.action && req.body.action === "create") {
        const categoryCreate = Category.build({
            user_id: req.session.user,
            name: req.body.name,
            description: req.body.description,
            type: req.body.type,
        });

        if (!(await categoryCreate.save())) {
            res.json({
                message: "Ooops, algo deu errado, contate o admin",
                type: "error",
            });
            return;
        }

        res.json({ redirect: "/categoria-editar?id=" + categoryCreate.id });
        return;
    }

    if (req.body.action && req.body.action === "update") {
        const categoryUpdate = Category.update(
            {
                name: req.body.name,
                description: req.body.description,
                type: req.body.type,
            },
            {
                where: {
                    id: req.body.category_id,
                },
            }
        );
        if (!categoryUpdate) {
            res.json({
                message: "Ooops, algo deu errado, contate o admin",
                type: "error",
            });
            return;
        }
        res.json({ message: "Registro atualizado", type: "success" });
        return;
    }

    if (req.body.action && req.body.action === "delete") {
        const categoryDelete = Category.destroy({
            where: {
                id: req.body.id,
            },
        });
        if (!categoryDelete) {
            res.json({
                message: "Ooops, algo deu errado, contate o admin",
                type: "error",
            });
            return;
        }
        res.json({ redirect: "/categorias" });
        return;
    }
};
