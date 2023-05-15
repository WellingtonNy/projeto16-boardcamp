import { Router } from "express";
import { validateSchema } from "../middlewares/validateSchema.middlewares.js";
import { getClients, getClientsId, postClients, putClients } from "../controllers/customers.controllers.js";
import { clientSchema } from "../schemas/clients.schemas.js"

const clientsRouter = Router()

clientsRouter.get ("/customers", getClients)
clientsRouter.get ("/customers/:id",getClientsId)
clientsRouter.post("/customers",validateSchema(clientSchema), postClients)
clientsRouter.put ("/customers/:id",validateSchema(clientSchema), putClients)


export default clientsRouter