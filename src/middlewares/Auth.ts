import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const privateRouter = async (req, res, next) => {
    if (!req.header("Authorization")) {
        res.sendStatus(401);
        return;
    }

    const [authType, token] = req.header("Authorization").split(" ");

    let success = false;
    let userAuthenticate = "";

    if (authType === "Bearer" && token) {
        try {
            userAuthenticate = jwt.verify(
                token,
                String(process.env.SECRET_KEY_JWT)
            );
            success = true;
        } catch (err) {
            console.log(err);
            res.sendStatus(401);
            return;
        }
    }

    if (success) {
        req.userAuth = userAuthenticate;
        return next();
    }

    res.sendStatus(401);
};
