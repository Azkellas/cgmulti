"use strict";

var util = require('util');
const fs = require('fs');

var exports = module.exports = {};

const games = ['code-of-kutulu', 'code-royale', 'tic-tac-toe', 'botters-of-the-galaxy', 'code4life', 'mean-max', 'wondev-woman', 'coders-of-the-caribbean',  'ghost-in-the-cell', 'fantastic-bits', 'hypersonic', 'codebusters', 'smash-the-code', 'coders-strike-back', 'back-to-the-code', 'great-escape', 'platinum-rift2', 'platinum-rift', 'poker-chip-race', 'game-of-drone', 'tron-battle']

exports.compare = async function (players)
{
    let results = {};
    results.players = {};
    results.games = {};
    results.players_not_found = [];
    results.players_found = [];

    players = players.split(' ');

    let games_ranks = await Promise.all(games.map(game => getRanksInMulti(game, players)));

    // stores players
    results.players = players;
    // stores game results
    for (let json of games_ranks)
        for (let game in json)
            results.games[game] = json[game];

    // check for players found / not found
    for (let player of players)
    {
        let found = false;
        for (let game of games)
        {
            game = prettify(game)
            if (!results.games[game][player])
            {
                console.log("Issue: player not in game " + game + ' ' + player);
                continue;
            }
            if (results.games[game][player].rank !== undefined)
            {
                found = true;
                console.log('found ' + player + ' in ' + game)
                console.log(results.games[game][player].rank)
                results.players_found.push(player)
                break;
            }
        }
        if (!found)
        {
            results.players_not_found.push(player)
        }
    }
    console.log(results);
    // compute firsts
    return results; 
}
    


const league_value_array = ['Legend', 'Gold', 'Silver', 'Bronze', 'Wood', 'no_league']
function league_value(league)
{
    let idx = league_value_array.indexOf(league);
    if (idx == -1)
    {
        // impossible case
        return 0;
    }
	return idx;
}

function rank_value(player_rank, game)
{
    if (typeof player_rank[game] === 'undefined')
        return 1e10;
    return player_rank[game]['rank'] + 1e4*league_value(player_rank[game]['league']);
}


const get_league_array = {
    1: 'Legend',
    2: 'Gold',
    3: 'Silver',
    4: 'Bronze'
};
function get_league(division_index, division_count)
{
    return get_league_array[division_count-division_index] || 'Wood'; // if less than 4, it is a wood league
}

function get_cardinal(value)
{
    let digit = value.toString().slice(-1);
    switch(digit)
    {
        case '1':
            return 'st';
        case '2':
            return 'nd';
        case '3':
            return 'rd';
        default:
            return 'th';
    }
}

// "code-royale" -> "Code Royale"
function prettify(game)
{
    return game.split('-').map(word => word[0].toUpperCase() + word.substr(1)).join(' ');
}

    


async function getRanksInMulti (multi, pseudos)
{
    let path_file = __dirname + '/leaderboards/' + multi + '.json';

    multi = prettify(multi);
    let readFile = util.promisify(fs.readFile);
    let content = await readFile(path_file);

    let data = JSON.parse(content);

    let users = data['success']['users'];

    let pseudoRemaining = pseudos.length;
    let result = {};
    result[multi] = {};
    let minValue = 1e21;
    let bestPlayer = '';
    for (let u of users)
    {
        if (pseudoRemaining == 0)
        {
            if (bestPlayer !== '')
                result[multi][bestPlayer]['first'] = 'first';
            return result;
        }

        // console.log(u)
        if (u['pseudo'])
        {
            for (let pseudo of pseudos)
            {

                if (u['pseudo'] === pseudo)
                {
                    let league = '';
                    if (u['league'])
                        league = get_league(u['league']['divisionIndex'], u['league']['divisionCount']);
                    if (league === '')
                        league = 'no_league';
                    let rank = u['localRank'];
                    result[multi][pseudo] = {'rank': rank + get_cardinal(rank), 'league': league, 'first':''};
                    if (rank_value(result[multi][pseudo], multi) < minValue)
                    {
                        minValue = rank_value(result[multi][pseudo], multi);
                        bestPlayer = pseudo;
                    }
                    pseudoRemaining--;
                    break;
                }
            }
        }
    }
    for (let pseudo of pseudos)
    {
        if (typeof result[multi][pseudo] === 'undefined')
        {
            result[multi][pseudo] = {'rank': undefined, 'league': undefined, 'first':''};
        }
    }
    if (bestPlayer !== '')
        result[multi][bestPlayer]['first'] = 'first';
    return result; // player not found
}
