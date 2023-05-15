import { Router } from "express"
import { validateSchema } from "../middlewares/validateSchema.middlewares.js"
import { deleteRentals, devolver, getRentals, postRentals } from "../controllers/rentals.controllers.js"
import { rentalsSchema } from "../schemas/rentals.schenas.js"


const rentalsRouter = Router()

rentalsRouter.get ("/rentals", getRentals)
rentalsRouter.post ("/rentals",validateSchema(rentalsSchema),postRentals)
rentalsRouter.post("/rentals/:id/return", devolver)
rentalsRouter.delete ("/rentals/:id", deleteRentals)


export default rentalsRouter