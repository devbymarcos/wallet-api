import { Router } from "express";
import * as CategoryController from "../controllers/categoryController.js";

const router = Router();

router.get("/category", CategoryController.category);

export default router;
