import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../models/User.js";
const { verify } = jwt;
dotenv.config();

export const privateRouter = async (req, res, next) => {
    // if (!req.session.tokenUser) {
    //     res.redirect("/login");
    //     return;
    // }
    // let decode = "";
    // try {
    //     decode = verify(
    //         req.session.tokenUser,
    //         String(process.env.SECRET_KEY_JWT)
    //     );
    // } catch (err) {
    //     console.log("Token não aceito");
    //     res.redirect("/login");
    // }

    // const user = await User.findOne({
    //     where: {
    //         id: decode.id,
    //         email: decode.email,
    //     },
    // });

    // if (!user) {
    //     res.redirect("/login");
    //     return;
    // }

    req.session.user = 1; //user.id; //;
    req.session.fullName = "Em manutencao"; // user.full_name; //;
    return next();
};
