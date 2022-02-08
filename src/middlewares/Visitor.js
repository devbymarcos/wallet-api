import { User } from "../models/User.js";

export const isVisitor = async (req, res) => {
    const visitor = await User.findByPk(req.session.user);

    if (visitor.level === 0) {
        res.render("pages/widgets/notpermission/notpermission");
    }
    next();
};
