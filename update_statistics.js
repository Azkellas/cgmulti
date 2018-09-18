const fs = require('fs');
var util = require('util');
var moment = require('moment');
var readFile = util.promisify(fs.readFile);

const games = ['legends-of-code-magic', 'code-of-kutulu', 'code-royale', 'tic-tac-toe', 'botters-of-the-galaxy', 'code4life', 'mean-max', 'wondev-woman', 'coders-of-the-caribbean',  'ghost-in-the-cell', 'fantastic-bits', 'hypersonic', 'codebusters', 'smash-the-code', 'coders-strike-back', 'back-to-the-code', 'great-escape', 'platinum-rift2', 'platinum-rift', 'poker-chip-race', 'game-of-drone', 'tron-battle']

const dateFormat = 'YYYY/MM/DD';

const dailyFile = __dirname + '/statistics/daily.json';

async function computeNewSubmits(game)
{
    let content = await readFile(__dirname + '/leaderboards/' + game + '.json');
    let data = JSON.parse(content);
    // console.log(data);
    let today = moment();
    let yesterday = today.clone().subtract(1, 'days');
    let users = data['success']['users'];
   
    let count = 0;
    for (let u of users)
    {
        // console.log(u)
        if (u['pseudo'])
        {
            if (yesterday.isSame(moment(u['creationTime']), 'days'))
            {
                //console.log(u['pseudo']);
                count++;
            }
        }
    }
    let result = {};
    result[game] = count;
    return result;
}


async function updateGraphDate()
{
    let game_counts_array = await Promise.all(games.map(game => computeNewSubmits(game)));

    let content = await readFile(dailyFile);
    let data = JSON.parse(content);
    let today = moment();
    today = today.subtract(1, 'days');
    today = today.format(dateFormat);
    
    data.dates.push(today);
    
    for (let json of game_counts_array)
        for (let game in json)
            data.games[game][today] = json[game];

    fs.writeFile(dailyFile, JSON.stringify(data), (err) => {  
        // throws an error, you could also catch it here
        if (err) throw err;
    
        // success case, the file was saved
    });
    
}

updateGraphDate();