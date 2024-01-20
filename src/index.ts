import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import { PORT } from './constants'
import sqlite3 from "sqlite3";
import { join } from "path";

const db = new sqlite3.Database(join(__dirname, '..', './db.sqlite3'))

const app = express()

// middleware
app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())
app.use(morgan('common'))

app.post('/', (req, res) => {
	const { query } = req.body;

	const sql_query = `SELECT id, url, title FROM crawl_result WHERE url LIKE ? OR title LIKE ? OR headings LIKE ? OR content LIKE ? ORDER BY id DESC LIMIT 10`
	const data = [`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`]
	db.all(sql_query, data, (err, rows) => {
		if (err) {
			console.error(err)
			return res.status(500).send({
				msg: "There was something wrong"
			})
		}
		if (rows) {
			console.log(rows)
			return res.status(200).send(
				rows
			)
		}
		return res.status(404).send({
			msg: `No data available for query: ${query}`
		})
	})
})

// 404 route handler
app.all('*', (_, res) => {
	res.status(404).send({
		msg: "The route is not available"
	})
})

// error handler
app.use((err: any, _:any, res:any, __:any) => {
	console.error(err)
	res.status(500).send({
		msg: "There was something wrong"
	})
})


app.listen(PORT, () => {
	console.log(`Server started on port ${PORT}`)
})
