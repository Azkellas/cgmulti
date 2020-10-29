# CG multi

Github repository of [CG multi](http://cgmulti.azke.fr)

It helps you with visualizing and comparing multiple players ranks as well as multi statistics.

This site is a first attempt to dive into web-related technologies and languages. As such, it is without a doubt, full of lousy issues (that I know of) and bad habits (that I don't). 
Feel free to review, comment or improve the code.

</br>

## How to set-up

- First run `npm install` or `yarn install` depending on your node package manager.

- Unzip `mocked_data.zip` to have default data to test with.

- Run `node node.js` for the website (accessed at `localhost:8080`).

## Updating data

- Run `update_leaderboards.py` to fetch the latest leaderboards.

- If you don't have them, create a `statistics` folder, with `daily.json` and `weekly.json` files inside containing only `{}` as content.

- Run `node update_statistics_(daily|weekly).js` to update the statistics.

