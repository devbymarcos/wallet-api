import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const privateRouter = async (req, res, next) => {
    if (!req.header("authorization")) {
        res.json({ authorization: "not authorized" });
        return;
    }
    const [authType, token] = req.header("authorization").split(" ");

    let success = false;
    if (authType === "Bearer") {
        try {
            jwt.verify(token, String(process.env.SECRET_KEY_JWT));
            success = true;
        } catch (err) {
            console.log(err);

            res.json({ authorization: "not authorized" });
        }
    }

    if (success) {
        return next();
    }

    res.json({ authorization: "not authorized" });
};
