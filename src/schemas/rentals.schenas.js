import joi from "joi"

export const rentalsSchema = joi.object({
    customerId: joi.string().required(),
    gameId: joi.string().required(),
    daysRented: joi.string().required(),
    })
    
