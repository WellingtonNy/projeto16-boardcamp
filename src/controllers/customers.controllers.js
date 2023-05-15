import { db } from '../database/database.connection.js';


export async function getClients(req, res) {

    try {

        const clients = await db.query("SELECT * FROM customers;")

        res.send(clients.rows)

    } catch (err) {

        res.status(500).send(err.message)

    }
}


export async function getClientsId(req, res) {

    const { id } = req.params

    try {
        const client = await db.query(`SELECT * FROM customers WHERE id = $1;`, [id])

        if (client.rows.length < 1) return res.status(404).send('Cliente não encontrado')

        res.send(client.rows[0])

    } catch (err) {

        res.status(500).send(err.message)

    }
}

export async function postClients(req, res) {

    const { name, phone, cpf, birthday } = req.body

    try {

        const client = await db.query(`SELECT * FROM customers WHERE cpf = $1;`, [cpf])

        if (client.rows.length > 0) return res.status(409).send('Cpf já cadastrado')

        await db.query(`INSERT INTO customers ("name", "phone", "cpf", "birthday") VALUES ($1, $2, $3, $4);`, [name, phone, cpf, birthday])

        res.sendStatus(201)

    } catch (err) {

        res.status(500).send(err.message)

    }
}

export async function putClients(req, res) {

    const { name, phone, cpf, birthday } = req.body
    const { id } = req.params

    try {
        const clientID = await db.query(`SELECT * FROM customers WHERE id = $1;`, [id])

        if (clientID.rows.length < 1) return res.status(404).send('Cliente não encontrado')

        const client = await db.query(`SELECT * FROM customers WHERE cpf = $1 AND id <> $2;`, [cpf, id])

        if (client.rows.length) return res.status(409).send('Cpf já cadastrado')

        await db.query(`UPDATE customers SET "name" = $1, "phone" = $2, "cpf" = $3, "birthday" = $4 WHERE id = $5;`,
            [name, phone, cpf, birthday, id])

        res.sendStatus(200)

    } catch (err) {

        res.status(500).send(err.message)

    }
}

