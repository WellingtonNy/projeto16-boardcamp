import { db } from '../database/database.connection.js';


export async function getGames(req, res) {

    try {

        const gamesList = await db.query("SELECT * FROM games;")

        res.send(gamesList.rows)

    } catch (err) {

        res.status(500).send(err.message)

    }
}


export async function postGames(req, res) {

    const { name, image, stockTotal, pricePerDay } = req.body;

    try {

        const game = await db.query(`SELECT * FROM games WHERE name = $1;`, [name])
        if (game.rows.length < 0) return res.status(409).send('Jogo já cadastrado!')

        await db.query(`INSERT INTO games ("name", "image", "stockTotal", "pricePerDay") VALUES ($1, $2, $3, $4);`, [name, image, stockTotal, pricePerDay])

        res.status(201).send('Jogo Criado!')

    } catch (err) {

        res.status(500).send(err.message)

    }
}

