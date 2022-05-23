import express from "express";
import path from "path";
import multer from "multer";
import dotenv from "dotenv";
import mainRoutes from "./src/routes/router.js";
import morgan from "morgan";
import cors from "cors";

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
app.use(cors());
const __dirname = path.resolve();

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
    res.status(404).json({
        message: "Voce errou o caminho",
    });
});

app.listen(process.env.PORT, () => {
    console.log("rodando porta :" + process.env.PORT);
});
