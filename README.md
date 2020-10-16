# CG multi

Github repository of [CG multi](http://cgmulti.azke.fr)

It helps you visualizing and comparing any player multi ranks.
The site is a first try to dive into web-related technologies and languages. As such, it is without doubt full of awful issues that I know of and bad habits that I don't.
Feel free to review, comment or improve the code.


## How to add a new multi

Add its url-name in **update_leaderboards.py** line **30**, **parse.js** line **5**, **update_statistics.js** and **update_statistics_weekly.js** lines **6** (not optimal, should be stored only once in the future).

## How to set-up

First run `npm install` or `yarn install` depending on your node package manager.

Run `update_leaderboards.py` to fetch the required data.
Create a `statistics` folder, and `daily.json` and `weekly.json` files inside with only `{}` as content.
Run `update_leaderboards(_weekly).js` to update the statistics.

Finally, run `node node.js` for the website (accessed at `localhost:8080`).

