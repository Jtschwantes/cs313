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

// let data = require('./data.js'); ///index.js

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
        return results;
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

    .get('/', (req, res) => res.render('pages/index.ejs'))
    .get('/createPost', (req, res) => res.render('pages/createPost.ejs'))
    .get('/error', (req, res) => res.render('pages/error.ejs'))
    .get('/home', (req, res) => res.render('pages/home.ejs'))
    .get('/about', (req, res) => res.render('pages/about.ejs'))
    .get('/viewItem/:id', (req, res) => {
        const id = req.params.id;
        res.render('pages/viewItem.ejs', {id})
    })
    .get('/editPost/:id', (req, res) => {
        const id = req.params.id;
        res.render('pages/editPost.ejs', {id})
    })

    .get('/items', async (req, res) => {
        try {
            const client = await pool.connect()
            const result = await client.query('SELECT * FROM post');
            // const results = { 'results': (result) ? result.rows : null };
            const results = result.rows;
            //   res.render('pages/db', results );
            res.send(results);
            client.release();
        } catch (err) {
            console.error(err);
            throw err;
        }
    })
    .get('/items/:id', async (req, res) => {
        const id = req.params.id;
        try {
            const client = await pool.connect()
            const result = await client.query(`SELECT * FROM post WHERE id = ${id}`);
            // const results = { 'results': (result) ? result.rows : null };
            res.send(result.rows);
            client.release();
        } catch (err) {
            console.error(err);
            throw err;
        }
    })
    .post("/items", async (req, res) => {
        let item = req.body
        console.log(req.body);
        try {
            const client = await pool.connect()
            await client.query(`INSERT INTO post(title, body) VALUES ('${item.title}', '${item.body}')`);
            // const results = { 'results': (result) ? result.rows : null }
            res.send(item);
            client.release();
        } catch (err) {
            console.error(err);
            throw err;
        }
        // return updated list
    })
    .put("/items/:id", async (req, res) => {
        const id = req.params.id;
        let item = req.body;
        try {
            const client = await pool.connect()
            await client.query(`INSERT INTO post(title, body) VALUES ('${item.title}', '${item.body}')`);
            await client.query(`DELETE FROM post WHERE id = ${id}`)
            res.send(item);
            client.release();
        } catch (err) {
            console.error(err);
            throw err;
        }
    })
    .delete("/items/:id", async (req, res) => {
        const id = req.params.id;
        try {
            const client = await pool.connect()
            const result = await client.query(`DELETE FROM post WHERE id = ${id}`);
            //   res.render('pages/db', results );
            res.send(result)
            client.release();
        } catch (err) {
            console.error(err);
            res.send(err);
        }
    })
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
