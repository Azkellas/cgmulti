util = require('util');

var exports = module.exports = {};

const games = ['code-of-kutulu', 'code-royale', 'tic-tac-toe', 'botters-of-the-galaxy', 'code4life', 'mean-max', 'wondev-woman', 'coders-of-the-caribbean',  'ghost-in-the-cell', 'fantastic-bits', 'hypersonic', 'codebusters', 'smash-the-code', 'coders-strike-back', 'back-to-the-code', 'great-escape', 'platinum-rift2', 'platinum-rift', 'poker-chip-race', 'game-of-drone', 'tron-battle']


exports.compare = async function (players)
{

    // returns an object
    // keys of object = game
    // keys of given game = players

    results = {}
    results['players'] = {}
    results['games'] = {}
    players = players.split(' ')
    
    let games_ranks = await Promise.all(games.map(game => getRanksInMulti(game, players)));
    // console.log(player_ranks)        
    
    // stores players
    results['players'] = players
    // stores game results
    for (var json of games_ranks)
        for (var game in json)
            results['games'][game] = json[game]

    console.log(results)
    // compute firsts
    return results        
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

    


async function getRanksInMulti (multi, pseudos)
{
    let path_file = __dirname + '/leaderboards/' + multi + '.json';

    multi = prettify(multi)
    const fs = require('fs');
    let readFile = util.promisify(fs.readFile);
    let content = await readFile(path_file);

    let data = JSON.parse(content);

    let users = data['success']['users'];

    let pseudoRemaining = pseudos.length
    let result = {}
    result[multi] = {}
    let minValue = 1e21
    let bestPlayer = ''
    for (u of users)
    {
        if (pseudoRemaining == 0)
        {
            if (bestPlayer !== '')
            result[multi][bestPlayer]['first'] = 'first'
            return result;
        }

        // console.log(u)
        if (u['pseudo'])
        {
            for (pseudo of pseudos)
            {

                if (u['pseudo'] === pseudo)
                {
                    let league = '';
                    if (u['league'])
                        league = get_league(u['league']['divisionIndex'], u['league']['divisionCount']);
                    if (league === '')
                        league = 'no_league'
                    let rank = u['localRank'];
                    result[multi][pseudo] = {'rank': rank + get_cardinal(rank), 'league': league, 'first':''}
                    if (rank_value(result[multi][pseudo], multi) < minValue)
                    {
                        minValue = rank_value(result[multi][pseudo], multi)
                        bestPlayer = pseudo
                    }
                    pseudoRemaining--;
                    break
                }
            }
        }
    }
    for (pseudo of pseudos)
    {
        if (typeof result[multi][pseudo] === 'undefined')
        {
            result[multi][pseudo] = {'rank': undefined, 'league': undefined, 'first':''}
        }
    }
    if (bestPlayer !== '')
        result[multi][bestPlayer]['first'] = 'first'
    return result// player not found
}
