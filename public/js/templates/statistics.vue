<template>
    <div id="statistics">
        <ul class="nav justify-content-center">
            <li class="nav-item">
                <a class="nav-link" :class="isCurrentFreq('daily')" v-on:click.prevent="newFrequency('daily')" style="cursor: pointer;">Daily</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" :class="isCurrentFreq('weekly')" v-on:click.prevent="newFrequency('weekly')" style="cursor: pointer;">Weekly</a>
            </li>
        </ul>

        <line-chart class="justify-content-center" id="dailyChart" :data="graphData" xtitle="date" ytitle="new submissions in the top1000" height="700px" :messages="{empty: 'Failed to load data. Try again or contact Azkellas.'}"></line-chart>

        <br /><br /><br />
        <div id="contestant">
            <table class="justify-content-center table table-dark table-striped table-bordered table-hover table-condensed table-sm" style="width: max-content;" align="center">
                <thead>
                    <tr>
                        <th scope="col" class="stickycol"></th>
                        <th v-for="date in stats.dates.slice().reverse()" :key="date"><div><span>{{printDate(date)}}</span></div></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(counts, game) in stats.games" :key="game">
                        <th scope="row" class="stickycol"><span class="game"><a :href='getLink(game)' target="_blank">{{prettify(game)}}</a></span></th>
                        <!-- displays players ranks-->
                        <td v-for="date of stats.dates.slice().reverse()" :key="date">
                            {{stats.games[game][date]}}
                        </td>
                    </tr>
                </tbody>
            </table>
        <div>
    </div>
</template>

<style>
    body{
        margin:0;
    }

    .stickycol {
        position: sticky;
        left:0;
        background-color:#212529;
        font-size:0.9rem
    }

    .table-dark.table-hover thead tr{
        font-size:0.9rem
    }

    .table-dark.table-hover tbody tr:hover .stickycol, .table-dark.table-hover tbody tr:hover {
        background-color:#525960;
    }

    .table-dark.table-hover{
        margin-bottom:0.5%;
    }

</style>

<script>
const baseUrl = 'https://www.codingame.com/multiplayer/bot-programming/';
const dateFormat = 'YYYY/MM/DD';
var month = {
  "01": "Jan",
  "02": "Feb",
  "03": "Mar",
  "04": "Apr",
  "05": "May",
  "06": "Jun",
  "07": "Jul",
  "08": "Aug",
  "09": "Sep",
  "10": "Oct",
  "11": "Nov",
  "12": "Dec"
};

module.exports = {
    data: function() {
        return {
            stats: {},
            graphData: {},
            locale: window.navigator.userLanguage || window.navigator.language,
            noYearLocaleFormat : ''
        };
    },

    props: [
        'frequency'
    ],

    mounted: function() {
        // this.$router.push('/players')
        this.getStats();

        // get local date format while writing in english
        moment.locale(this.locale);
        var data = moment.localeData()._longDateFormat;
        moment.locale("en-US");
        moment.localeData()._longDateFormat = data;

        noYearLocaleFormat = moment
        .localeData()
        .longDateFormat('L')
        .replace(/[,\/-/.]*\s*Y+\s*/, '');
    },

    methods: {
        isCurrentFreq: function(freq) {
            if (freq === this.frequency)
                return 'router-link-active';  // little cheat to bold it
            else
                return '';
        },

        newFrequency: function(newF) {
            this.frequency = newF;
            this.getStats();
        },

        getStats: function() {
            var vm = this;
            axios
            .get("/statisticsQuery/", {
                params: {
                    frequency: this.frequency
                }
            }).then(function(response) {
                vm.stats = response.data;
                vm.computeGraph();
            });
        },

        printDate: function(date) {
            date = moment(date, dateFormat);
            return "〚"+ month[date.format("MM")] +date.format(" DD, YY〛");
        },


        // "code-royale" -> "Code Royale"
        prettify: function(game) {
            return game
                .split("-")
                .map(word => word[0].toUpperCase() + word.substr(1))
                .join(" ");
        },

        computeGraph: function() {
            let data = this.stats;
            let result = [];
            result.dataset = [];
            for (let game in data.games)
            {
                let gameStats = {};
                gameStats.name = game;
                gameStats.data = {};
                for (let date of data.dates)
                {
                    if (data.games[game][date])
                        gameStats.data[date] = data.games[game][date];
                    else
                        gameStats.data[date] = 0;
                }
                result.push(gameStats);
            }
            this.graphData = result;
        },

        getLink: function(game) {
            // Game Of Drones has API ref game-of-drone and url path game-of-drones
            const gamePath = game + ((game === 'game-of-drone') ? 's' : '');
            return baseUrl + gamePath + "/";

        }

    }
};


</script>
