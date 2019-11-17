const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 5000;

const conversions = require('./rates.js');

const server = express()
    .use(express.static(path.join(__dirname, 'public')))
    .use(bodyParser.urlencoded({ extended: true }))
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')
    .get('/', (req, res) => res.render('pages/index'))
    .post('/getRate', (req, res) => {
        const {weight, type} = req.body;
        let price = conversions[type][weight];
        let name = conversions[type].name;
        if (price !== undefined) return res.render('pages/rate.ejs', {weight, name, price});
        else res.render('pages/error.ejs', {weight, name})
    });

server.listen(PORT, () => console.log(`Listening on ${ PORT }`));
