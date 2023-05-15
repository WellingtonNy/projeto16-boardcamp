import { Router } from "express";
//import productRouter from "./products.routes.js"
import gamesRouter from "./games.routes.js";

const router = Router();
router.use(gamesRouter);
//router.use(productRouter);

export default router;