'use strict';

var util = require('util');
const fs = require('fs');

var exports = module.exports = {};

const games = [];
for (let file_name of fs.readdirSync(__dirname + '/leaderboards/')) {
    games.push(file_name.slice(0, -5));
}

function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}

/* leaderboards analysis */
exports.compare = async function (players)
{
    let results = {};
    results.players_not_found = [];
    results.players_found = [];
    results.games = {};
    players = players.split(' ');

    let games_ranks = await Promise.all(games.map(game => getRanksInMulti(game, players)));

    // stores game results
    for (let json of games_ranks)
        for (let game in json)
            results.games[game] = json[game];

    for (let pseudo of players)
    {
        let alreadyFound = false
        for (let game in results.games)
        {
            if (alreadyFound)
                break;

            for (let realPseudo in results.games[game])
            {
                if (pseudo.toLowerCase() === realPseudo.toLowerCase())
                {
                    alreadyFound = true
                    results.players_found.push(realPseudo)
                    break;
                }
            }
        }
        if (!alreadyFound)
            results.players_not_found.push(pseudo)
    }
    results.players_found = results.players_found.filter(onlyUnique)
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
    let digit = value % 10;
    let tens = (value % 100 - value % 10) / 10;
    switch(digit)
    {
        case 1:
            return 'st';
        case 2:
            return tens != 1 ? 'nd' : 'th';
        case 3:
            return 'rd';
        default:
            return 'th';
    }
}

async function getRanksInMulti (multi, pseudos)
{
    let path_file = __dirname + '/leaderboards/' + multi + '.json';

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
            // the case where there is a single existing player is handle in vue method tdClass
            // this is to avoid the case where there is only a player in a multi but multiple overall
            if (bestPlayer !== '' && pseudos.length > 1)
                result[multi][bestPlayer]['first'] = 'first';
            return result;
        }

        if (u['pseudo'])
        {
            for (let pseudo of pseudos)
            {

                if (u['pseudo'].toLowerCase() === pseudo.toLowerCase())
                {
                    let realPseudo = u['pseudo'];
                    let league = '';
                    let isCommunity = false;
                    if (u['league']) {
                        league = get_league(u['league']['divisionIndex'], u['league']['divisionCount']);
                        if (u['league']['divisionOffset']) {
                            // this is a community puzzle: there is only wood leagues, we consider no league at all
                            league = 'no_league';
                            isCommunity = true;
                        }
                    }
                    if (league === '')
                        league = 'no_league';
                    
                    // if community, we take global rank since there are only wood leagues, else we take league rank
                    let rank = u[isCommunity ? 'rank' : 'localRank'];

                    result[multi][realPseudo] = {'rank': rank + get_cardinal(rank), 'league': league, 'date': u['creationTime'], 'first':''};
                    if (rank_value(result[multi][realPseudo], multi) < minValue)
                    {
                        minValue = rank_value(result[multi][realPseudo], multi);
                        bestPlayer = realPseudo;
                    }
                    pseudoRemaining--;
                    break;
                }
            }
        }
    }
    // the case where there is a single existing player is handle in vue method tdClass
    // this is to avoid the case where there is only a player in a multi but multiple overall
    if (bestPlayer !== '' && pseudos.length > 1)
        result[multi][bestPlayer]['first'] = 'first';

    return result; // some players were not found
}



/* statistics analysis */
exports.getStats = async function(type) {
    let path_file = __dirname + '/statistics/';
    if (type === 'daily')
        path_file += 'daily.json';
    if (type === 'weekly')
        path_file += 'weekly.json';
    let readFile = util.promisify(fs.readFile);
    let content = await readFile(path_file);
    let data = JSON.parse(content);
    return data;
}