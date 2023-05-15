import { Router } from "express";
import { validateSchema } from "../middlewares/validateSchema.middlewares.js";
import { gamesSchema } from "../schemas/games.schemas.js";
import { getGames, postGames } from "../controllers/games.controllers.js";

const gamesRouter = Router();

gamesRouter.get("/games", getGames);
gamesRouter.post("/games", validateSchema(gamesSchema), postGames);


export default gamesRouter;