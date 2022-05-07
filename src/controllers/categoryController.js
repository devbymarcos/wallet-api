import { Category } from "../models/Category.js";

export const category = async (req, res) => {
    let categories = await Category.findAll({
        where: {
            user_id: "1",
        },
    });

    let formatCategory = categories.map((item) => {
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

    console.log(formatCategory);
    res.json({
        data: formatCategory,
    });
};
export const categoryCreate = (req, res) => {
    const userName = req.session.fullName;
    res.render("pages/widgets/category/category-create", {
        data: true,
        categories: true,
        userName,
    });
};
export const categoryEdit = async (req, res) => {
    const userName = req.session.fullName;
    const category = await Category.findByPk(req.query.id);
    const select = (type, value) => {
        return type == value ? "selected" : "";
    };

    const selIcome = select(category.type, "income");
    const selExpense = select(category.type, "expense");

    res.render("pages/widgets/category/category-edit", {
        category,
        selects: { selIcome, selExpense },
        userName,
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
