import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

type UserType = {
    id: number;
    email: string;
    iat: number;
    exp: number;
};

export const privateRouter = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.header("Authorization");

    if (authHeader === undefined || authHeader === null) {
        res.sendStatus(401);
        return;
    }
    const [authType, token] = authHeader.split(" ");

    let success = false;
    let userAuthenticate: string | UserType | JwtPayload | undefined;

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
        res.locals.userAuth = userAuthenticate;
        return next();
    }

    res.sendStatus(401);
};
