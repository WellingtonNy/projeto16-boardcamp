import joi from "joi"

export const clientSchema = joi.object({
    name: joi.string().required(),
    phone: joi.string().pattern(/^[0-9]+$/).min(10).max(11).required(),
    cpf: joi.string().pattern(/^[0-9]+$/).min(11).max(11).required(),
    birthday: joi.date().format('YYYY-MM-DD').required(),
    })
    
