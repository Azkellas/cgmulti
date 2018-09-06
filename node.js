var express = require('express');
var bodyParser = require('body-parser'); // Charge le middleware de gestion des paramètres
var urlencodedParser = bodyParser.urlencoded({ extended: false });

const path = require('path')
const parser = require('./parse.js');
var app = express();


app.use(express.static('./public'))

// creates array
.use(function(req, res, next){
    if (typeof(players_data) === 'undefined') {
        players_data = {};
    }
    
    next();
})


// main page
.get('/', function(req, res) {
    res.render('cgmulti.ejs', {data: players_data});
})


// request with players
.post('/players/', urlencodedParser, function(req, res) {
    players_data = {};
    parser.compare(req.body.players).then(function(dict) {
        players_data = dict
        res.redirect('/');
    });
})


// redirection
.use(function(req, res, next){
    res.redirect('/');
})


.listen(8080);