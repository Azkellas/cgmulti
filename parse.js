util = require('util');

module.exports = {
    compare : async function(players)
    {

        // returns an object
        // keys of object = game
        // keys of given game = players

        results = {}
        results['players'] = {}
        results['games'] = {}

        players = players.split(' ')

        let player_ranks = await Promise.all(players.map(player => getRanks(player)));
        // console.log(player_ranks)        

        // stores players
        results['players'] = players

        for (let game in player_ranks[0])
        {
            // game = string name (formatted)
            // console.log("game")
            // console.log(game)
            // add game
            results['games'][game] = {}
            for (let i = 0; i < players.length; ++i)
            {
                const player_rank = player_ranks[i]
                // add player rank for the given game
                if (player_rank[game])
                {
                    // console.log("pk: ")
                    // console.log(player_rank)
                    // console.log(player_rank[game])
                    const rank = player_rank[game]
                    const values =  (player_ranks.map(p_rank => rank_value(p_rank, game)))
                    let min_rank = Math.min.apply(null, values)
                    if (isNaN(min_rank))
                    {
                        console.log(values)
                        console.log("NaN")
                        console.log(player_ranks)
                    }
                    let is_first = (rank_value(player_rank, game) === min_rank)
                    console.log("ranks: " + min_rank + " <=? " + rank_value(player_rank, game))
                    // construct output rank
                    results['games'][game][i] = copy(rank)
                    results['games'][game][i]['rank'] += get_cardinal(rank['rank'])
                    if (is_first)
                    {
                        results['games'][game][i]['first'] = 'first'
                        console.log('found first')
                    }
                    else
                    {
                        results['games'][game][i]['first'] = ''
                    }
                }
                else
                {
                    results['games'][game][i] = null
                }
            }
        }
        return results        
    }
        
};


function copy(mainObj) {
    let objCopy = {}; // objCopy will store a copy of the mainObj
    let key;
  
    for (key in mainObj) {
        objCopy[key] = mainObj[key]; // copies each property to the objCopy object
    }
    return objCopy;
}
  
function league_value(league)
{

    if (league == "Legend")
        return 0
	if (league == "Gold")
        return 1
	if (league == "Silver")
        return 2
	if (league == "Bronze")
        return 3
	if (league == "Wood")
        return 4
    if (league == "no_league")
        return 0
	return 0  // impossible case
}

function rank_value(player_rank, game)
{
    if (typeof player_rank[game] === 'undefined')
        return 1e10
    return player_rank[game]['rank'] + 1e4*league_value(player_rank[game]['league'])
}


function get_league(division_index, division_count)
{
    return {
        1: 'Legend',
		2: 'Gold',
		3: 'Silver',
		4: 'Bronze'
	}[division_count-division_index] || 'Wood' // if less than 4, it is a wood league
}

function get_cardinal(value)
{
    let digit = value.toString().slice(-1)
    if (digit == '1')
       return 'st';
	if (digit == '2')
        return 'nd';
	if (digit == '3')
        return 'rd';
	return 'th';
}

// "code-royale" -> "Code Royale"
function prettify(game)
{
    game = game.split('')
    for (let i = 0; i < game.length - 1; i++) {

        if (game[i] === '-')
        {
            game[i+1] = game[i+1].toUpperCase()
            game[i]   = ' '
        }
    }
    game[0] = game[0].toUpperCase()
    return game.join('')
}

    

async function getRankInMulti (pseudo, multi)
{
    let path_file = __dirname + '/leaderboards/' + multi + '.json';

    const fs = require('fs');
    let readFile = util.promisify(fs.readFile);
    let content = await readFile(path_file);

    let data = JSON.parse(content);

    let users = data['success']['users'];

    for (u of users)
    {
        // console.log(u)
        if (u['pseudo'])
        {
            if (u['pseudo'] === pseudo)
            {
                let league = '';
                if (u['league'])
                {
                    league = get_league(u['league']['divisionIndex'], u['league']['divisionCount']);
                }
                if (league === '')
                    league = 'no_league'
                let rank = u['localRank'];
                console.log("getRankMulti " + pseudo + " " + rank + " " + league)
                return [multi, rank, league]
            }
        }
    }
    return [multi, undefined, undefined] // player not found
}

const games = ['code-of-kutulu', 'code-royale', 'tic-tac-toe', 'botters-of-the-galaxy', 'code4life', 'mean-max', 'wondev-woman', 'coders-of-the-caribbean',  'ghost-in-the-cell', 'fantastic-bits', 'hypersonic', 'codebusters', 'smash-the-code', 'coders-strike-back', 'back-to-the-code', 'great-escape', 'platinum-rift2', 'platinum-rift', 'poker-chip-race', 'game-of-drone', 'tron-battle']


async function getRanks(nickname)
{
    let player_ranks = await Promise.all(games.map( game => getRankInMulti(nickname, game)))
    console.log("ranks")
    console.log(player_ranks)
    let ranks = {}
    for (let i = 0; i < player_ranks.length; ++i)
    {
        let [game, rank, league] = player_ranks[i]
        console.log(game)
        if (rank)
        {
            ranks[prettify(game)] = {'rank': rank, 'league': league}
        }
        else
        {
            // player not found
            ranks[prettify(game)] = undefined
        }
        console.log("getRanks " + nickname + ": " + game)
        console.log(ranks[prettify(game)])
    }
    console.log("output")
    console.log(ranks)
    return ranks
}

