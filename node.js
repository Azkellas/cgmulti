"use strict";

var url = require('url')
var express = require('express');
var bodyParser = require('body-parser'); // Charge le middleware de gestion des paramètres
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var _ = require('underscore');

const parser = require('./parse.js');
var app = express();


app.use(express.static('./public'))


// get with players  (probably ugly as fuck)
.get('/', urlencodedParser, function(req, res) {
    res.sendFile('index.html', {root: __dirname });
})

// request with players
// .post('/players/', urlencodedParser, function(req, res) {
//     parser.compare(req.body.players).then(function(players_data) {
//         res.render('cgmulti.ejs', {data: players_data, _: _});
//     });
// })

// get with players  (probably ugly as fuck)
.get('/players/', urlencodedParser, function(req, res) {
    console.log('get')
    var queryData = url.parse(req.url, true).query;
    console.log(queryData);
    parser.compare(queryData.playersQuery).then(function(players_data) {
        res.send(players_data);
    });

})

// // redirection
// .use(function(req, res, next){
//     res.redirect('/players/');
// })


.listen(8080);