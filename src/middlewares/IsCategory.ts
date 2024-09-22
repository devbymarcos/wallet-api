import Category from "../models/category/Category.js";

// export const isCategory = async (req, res, next) => {
//     const categ = await Category.findAll({
//         where: {
//             user_id: req.session.user,
//         },
//     });

//     if (!categ.length) {
//         res.redirect("/categorias?category=not");
//         return;
//     }
//     next();
// };
