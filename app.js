import express from "express";
import path from "path";
import multer from "multer";
import mustache from "mustache-express";
import dotenv from "dotenv";
import mainRoutes from "./src/routes/router.js";
import morgan from "morgan";
import session from "express-session";
import flash from "connect-flash";
import favicon from "serve-favicon";

import fs from "fs";
import https from "https";
import { createBrotliCompress } from "zlib";

dotenv.config();
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./tmp");
    },
    filename: (req, file, cb) => {
        let randomName = Math.floor(Math.random() * 9999999);
        cb(null, `${randomName + Date.now()}.jpg`);
    },
});
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowed = ["image/jpg", "image/jpeg", "image/png"];
        cb(null, allowed.includes(file.mimetype));
    },
    limits: { fieldSize: 2000000 },
});

const app = express();
app.disable("x-powered-by");

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: true,
        saveUninitialized: true,
        cookie: {
            maxAge: 30 * 60 * 1000,
            sameSite: "lax",
        },
    })
);

app.use(flash());

const __dirname = path.resolve();

//favicon
app.use(favicon(path.join(__dirname, "public", "favicon.ico")));

//template engine
app.set("view engine", "mustache");
app.set("views", path.join(__dirname, "./src/views"));
app.engine("mustache", mustache());

const options = {
    cert: fs.readFileSync(path.join(__dirname, "ssl", "localhost.crt")),
    key: fs.readFileSync(path.join(__dirname, "ssl", "localhost.key")),
};
// for parsing multipart/form-data
app.use(upload.array("files"));

//pasta public
app.use(express.static(path.join(__dirname, "public")));

// habilita pegar dados no corpo da requizição
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));

//rotas do site
app.use("/", mainRoutes);

//page 404
app.use((req, res) => {
    res.status(404).send("Página não encontrada");
});

app.listen(process.env.PORT, () => {
    console.log("rodando porta :" + process.env.PORT);
});
