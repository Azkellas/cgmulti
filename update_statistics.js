const fs = require('fs');
var util = require('util');
var moment = require('moment');
var readFile = util.promisify(fs.readFile);

const games = ["a-code-of-ice-and-fire", "code-a-la-mode", "cultist-wars", "bandas", "bit-runner-2048", "yavalath", "langton-s-ant", "checkers", "vindinium", "legends-of-code-magic", "code-of-kutulu", "code-royale", "tic-tac-toe", "botters-of-the-galaxy", "code4life", "mean-max", "wondev-woman", "coders-of-the-caribbean",  "ghost-in-the-cell", "fantastic-bits", "hypersonic", "codebusters", "smash-the-code", "coders-strike-back", "back-to-the-code", "great-escape", "platinum-rift2", "platinum-rift", "poker-chip-race", "game-of-drone", "tron-battle", "xmas-rush"];	

const dateFormat = 'YYYY/MM/DD';

const dailyFile = __dirname + '/statistics/daily.json';

async function computeNewSubmits(game)
{
    let content = await readFile(__dirname + '/leaderboards/' + game + '.json');
    let data = JSON.parse(content);
    // console.log(data);
    let today = moment();
    let yesterday = today.clone().subtract(1, 'day');
    let users = data['success']['users'];
   
    let count = 0;
    for (let u of users)
    {
        // console.log(u)
        if (u['pseudo'])
        {
            if (yesterday.isSame(moment(u['creationTime']), 'day'))
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

    // new file
    if (data.dates === undefined)
        data.dates = [];
    if (data.games === undefined)
        data.games = {};

    data.dates.push(today);
    
    for (let json of game_counts_array)
    {
       for (let game in json)
        {
            // new game
            if (data.games[game] === undefined)
                data.games[game] = {};
    
            data.games[game][today] = json[game];
        }
    }

    // erase too old dates
    while (data.dates.length > 21)
    {
        const oldDate = data.dates[0];
        data.dates.splice(0, 1);
        for (const game in data.games)
            delete data.games[game][oldDate];
    }

    fs.writeFile(dailyFile, JSON.stringify(data), (err) => {  
        // throws an error, you could also catch it here
        if (err) throw err;
    
        // success case, the file was saved
    });
    
}

updateGraphDate();