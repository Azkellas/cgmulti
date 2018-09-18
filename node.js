"use strict";

var url = require('url')
var express = require('express');
var bodyParser = require('body-parser'); // Charge le middleware de gestion des paramètres
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var _ = require('underscore');

const parser = require('./parse.js');
var app = express();


app.use(express.static('./public'))


.get('/', urlencodedParser, function(req, res) {
    res.redirect('/players');
    // res.sendFile('index.html', {root: __dirname });
})

.get('/players', urlencodedParser, function(req, res) {
    res.sendFile('index.html', {root: __dirname });
})

.get('/statistics', urlencodedParser, function(req, res) {
    res.sendFile('index.html', {root: __dirname });
})

// get with players  (probably ugly as fuck)
.get('/playersQuery/', urlencodedParser, function(req, res) {
    console.log('playersQuery')
    var queryData = url.parse(req.url, true).query;
    console.log(queryData);
    if (queryData.playersQuery === undefined)
        //res.redirect('/');
        res.send({});
    else
    {
        queryData.playersQuery = queryData.playersQuery.trim();
        parser.compare(queryData.playersQuery).then(function(players_data) {
            res.send(players_data);
        });
    }

})

// get with players  (probably ugly as fuck)
.get('/statisticsQuery/', urlencodedParser, function(req, res) {
    console.log('statisticsQuery')
    parser.getDailyStats().then(function(result) {
            res.send(result);
    });
})

// redirection
.use(function(req, res, next){
    res.redirect('/');
})


.listen(8080);