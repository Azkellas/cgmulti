const fs = require('fs');
var util = require('util');
var moment = require('moment');
var readFile = util.promisify(fs.readFile);

const games = [];
for (let file_name of fs.readdirSync(__dirname + '/leaderboards/')) {
    games.push(file_name.slice(0, -5));
}
const dateFormat = 'YYYY/MM/DD';

const dailyFile = __dirname + '/statistics/weekly.json';

async function computeNewSubmits(game)
{
    let content = await readFile(__dirname + '/leaderboards/' + game + '.json');
    let data = JSON.parse(content);
    moment.locale('fr'); // monday to sunday
    let today = moment();
    let date = today.clone().subtract(1, 'day');
    let users = data['users'];
   
    let count = 0;
    for (let u of users)
    {
        if (u['pseudo'])
        {
            if (date.isSame(moment(u['creationTime']), 'week'))
            {
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
    today = today.subtract(7, 'days'); // the monday before
    today = today.format(dateFormat);

    // new file
    if (data.dates === undefined)
        data.dates = [];
    if (data.games === undefined)
        data.games = {};

    if (!data.dates.includes(today))
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

    fs.writeFile(dailyFile, JSON.stringify(data), (err) => {  
        // throws an error, you could also catch it here
        if (err) throw err;
    
        // success case, the file was saved
    });
    
}

updateGraphDate();