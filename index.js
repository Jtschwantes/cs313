const express = require('express');
const path = require('path');
const url = require('url');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 5000;

const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

let data = require('./data.js'); ///index.js

// function calculate(req, res) {
//     const {weight, type} = req.body;
//     let price = conversions[type][weight];
//     let name = conversions[type].name;
//     if (price !== undefined) return res.render('pages/rate.ejs', {weight, name, price});
//     else res.render('pages/error.ejs', {weight, name})
// }

async function getDbRows() {
    try {
        const client = await pool.connect()
        const result = await client.query('SELECT * FROM post');
        // const results = { 'results': (result) ? result.rows : null };
        const results = result.rows;
        //   res.render('pages/db', results );
        client.release();
        return results.rows;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

const server = express()
    .use(express.static(path.join(__dirname, 'public')))
    // .use(bodyParser.urlencoded({ extended: true }))
    .use(bodyParser.json())

    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')

    .get('/', (req, res) => res.render('pages/index'))
    .get('/error', (req, res) => res.render('pages/error.ejs'))

    .get('/items', async (req, res) => {
        res.send(getDbRows());
    })
    .get('/items/:id', async (req, res) => {
        const id = req.params.id;
        const results = await getDbRows();
        const item = results.where(i => i.id == id);

        if (item) {
            res.json(item);
        } else {
            res.json({ message: `item ${id} doesn't exist`})
        }
    })
    .post("/items", (req, res) => {
        let search = url.parse(req.url).search.slice(1)
        let arr = search.split("&");
        let obj = arr.reduce((acc, cur) => {
            cur = cur.replace(/%20/g, " ").split('=');
            acc[cur[0]] = cur[1];
            return acc;
        }, {})
        // add new item to array
        data.push(obj)
        // return updated list
        res.json(data);
    })
    .put("/items/:id", (req, res) => {
        const id = req.params.id;

        const item = data.find(i => i.id === id);
        if (item === undefined) {
            res.json({ message: `item ${id} doesn't exist`});
            return;
        }

        data = data.filter(i => i.id != id)
        
        let search = url.parse(req.url).search.slice(1)
        let arr = search.split("&");
        let obj = arr.reduce((acc, cur) => {
            cur = cur.replace(/%20/g, " ").split('=');
            acc[cur[0]] = cur[1];
            return acc;
        }, {})
        obj["id"] = id;
        data.push(obj);

        res.json(data);
    })
    .delete("/items/:id", (req, res) => {
        const id = req.params.id;
        data = data.filter(i => i.id != id)
        res.json(data);
    })
    // .post('/getRate', calculate)
    .get('/db', async (req, res) => {
        try {
            const client = await pool.connect()
            const result = await client.query('SELECT * FROM post');
            const results = { 'results': (result) ? result.rows : null };
            //   res.render('pages/db', results );
            res.send(results)
            client.release();
        } catch (err) {
            console.error(err);
            res.send(err);
        }
    })

server.listen(PORT, () => console.log(`Listening on ${ PORT }`));
