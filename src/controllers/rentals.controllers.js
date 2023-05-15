import { db } from "../database/database.connection.js";
import dayjs from "dayjs";

export async function getRentals(req, res) {

    try {

        const rentals = await db.query(`SELECT rentals.*, customers.name AS "customerName", games.name AS "gameName"
            FROM rentals JOIN customers ON rentals."customerId" = customers.id
            JOIN games ON rentals."gameId" = games.id`)


        const rentalsMap = rentals.rows.map((ren) => {

            ren.customer = { id: ren.customerId, name: ren.customerName }
            ren.game = { id: ren.gameId, name: ren.gameName }

            delete ren.customerName
            delete ren.gameName
            return ren
        })

        res.send(rentalsMap)

    } catch (err) {

        res.status(500).send(err.message)

    }
}



export async function postRentals(req, res) {

    const { customerId, gameId, daysRented } = req.body

    try {

        const jogoId = await db.query(`SELECT * FROM games WHERE id = $1;`, [gameId])

        const clientId = await db.query(`SELECT * FROM customers WHERE id = $1;`, [customerId])


        if (!clientId.rowCount || !jogoId.rowCount) return res.sendStatus(400)


        const jogo = jogoId.rows[0]

        const rJogoId = await db.query(`SELECT * FROM rentals WHERE "gameId" = $1 AND "returnDate" IS NULL`, [jogo.id]);

        if (rJogoId.rowCount === jogo.stockTotal) return res.sendStatus(400)


        const originalPrice = daysRented * jogo.pricePerDay;

        const rentDate = dayjs().format("YYYY-MM-DD")

        await db.query(`INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "originalPrice") VALUES ($1, $2, $3, $4, $5)`,
            [customerId, gameId, rentDate, daysRented, originalPrice]

        );


        res.status(201).send('Jogo alugado')


    } catch (err) {

        res.status(500).send(err.message)

    }
}


export async function devolver(req, res) {

    const { id } = req.params

    try {

        const aluguel = await db.query(`SELECT rentals.*, games."pricePerDay" FROM rentals JOIN games ON rentals."gameId" = games.id WHERE rentals.id = $1;`, [id])

        if (!aluguel.rowCount) return res.sendStatus(404)

        const ren = aluguel.rows[0]

        if (ren.returnDate !== null) return res.sendStatus(400)

        const data = dayjs().format("YYYY-MM-DD")

        //diferença em dias 
        const sobra = dayjs(data).diff(dayjs(ren.rentDate), "day") - ren.daysRented


        const valorAtraso = sobra > 0 ? sobra * ren.pricePerDay : 0

        await db.query(`UPDATE rentals SET "returnDate" = $1, "delayFee" = $2 WHERE id = $3`, [data, valorAtraso, id])

        res.sendStatus(200)


    } catch (err) {

        res.status(500).send(err.message)

    }
}



export async function deleteRentals(req, res) {

    const { id } = req.params

    try {

        const aluguel = await db.query(`SELECT * FROM rentals WHERE id = $1`,[ id])

        if (!aluguel.rows[0]) return res.sendStatus(404)

        if (aluguel.rows[0].returnDate === null) return res.sendStatus(400)

        await db.query(`DELETE FROM rentals WHERE id = $1;`,[ id])

        res.sendStatus(200)

        
    } catch (err) {

        res.status(500).send(err.message)

    }
}





