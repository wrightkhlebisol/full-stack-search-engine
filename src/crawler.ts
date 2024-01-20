import axios from 'axios'
import { parse } from 'node-html-parser';
import {join} from 'path';
import sqlite3 from 'sqlite3';
const db = new sqlite3.Database(join(__dirname, '..', './db.sqlite3'))

//setup the initial tables
db.serialize(() => {
	db.run(`CREATE TABLE IF NOT EXISTS crawl_result (
		id INTEGER PRIMARY KEY AUTOINCREMENT, 
		url TEXT NOT NULL,
		title TEXT, 
		headings TEXT NOT NULL,
		content TEXT NOT NULL
		)
	`)
})

const crawlAndIndex = async (wrd: string) => {

	try {
		const domain = 'https://en.wikipedia.org';
		const http_response = await axios.get(`${domain}/wiki/${wrd}`);
		const p = parse(http_response.data)
		const all_href = p.querySelectorAll('a')
			.map(ele => ele.getAttribute('href'))
			.map(href => {
				if (href?.startsWith('/')) {
					return `${domain}/${href}`
				}
				if (href?.split(':')[0] === 'https') {
					return href
				} else {
					return;
				}
			})
		for (let i = 0; i <= all_href.length; i++){
			try {
				if (all_href[i] === undefined) {
					continue
				}
				const content = await axios.get(String(all_href[i]))
				const parsed_content = parse(content.data)
				const title = parsed_content.querySelector('title')?.text
				const headings = parsed_content.querySelectorAll('h1, h2, h3, h4, h5').map(ele => ele.text);
				console.log(title, headings)
				db.run(`INSERT INTO crawl_result (url, title, headings, content) VALUES (?, ?, ?, ?)`, [all_href[i], title, headings.join(' | '), parsed_content.text])
			} catch (error) {
				console.error(error)
				console.error('error while crawling', all_href[i])
			}
		}
	}catch(error){
		console.error(error)
	}
}

crawlAndIndex('india')