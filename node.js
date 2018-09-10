"use strict";


var express = require('express');
var bodyParser = require('body-parser'); // Charge le middleware de gestion des paramètres
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var _ = require('underscore');

const parser = require('./parse.js');
var app = express();


app.use(express.static('./public'))



// request with players
.post('/players/', urlencodedParser, function(req, res) {
    parser.compare(req.body.players).then(function(players_data) {
        res.render('cgmulti.ejs', {data: players_data, _: _});
    });
})

// get with players  (probably ugly as fuck)
.get('/players/', urlencodedParser, function(req, res) {
    res.render('cgmulti.ejs', {data: {}, _: _});
})

// redirection
.use(function(req, res, next){
    res.redirect('/players/');
})


.listen(8080);