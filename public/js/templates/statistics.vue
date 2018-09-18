<template>
    <div id="statistics">
        <line-chart id="dailyChart" :data="graphData" height="700px" :messages="{empty: 'Failed to load data. Try again or contact Azkellas.'}"></line-chart>

        <br /><br /><br />
        <table class="table table-dark table-striped table-bordered table-hover table-condensed table-sm" style="width:auto;" align="center">
            <thead>
                <tr>
                    <th scope="col"></th>
                    <th v-for="date in dailyData.dates" :key="date">{{date}}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(counts, game) in dailyData.games" :key="game">
                    <!-- game -->
                    <th scope="row"><span class="game"><a :href='getLink(game)' target="_blank">{{prettify(game)}}</a></span></th>
                    <!-- displays players ranks-->
                    <td v-for="date of dailyData.dates" :key="date">
                        {{dailyData.games[game][date]}}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style>
</style>

<script>
const baseUrl = 'https://www.codingame.com/multiplayer/bot-programming/';

module.exports = {
    data: function() {
        return {
            dailyData: {},
            graphData: {},
            locale: window.navigator.userLanguage || window.navigator.language
        };
    },

    mounted: function() {
        // this.$router.push('/players')
        this.getDailyStats();

        // get local date format while writing in english
        moment.locale(this.locale);
        var data = moment.localeData()._longDateFormat;
        moment.locale("en-US");
        moment.localeData()._longDateFormat = data;
    },

    methods: {
        getDailyStats: function() {
            var vm = this;

            axios
            .get("/statisticsQuery/", {}).then(function(response) {
                vm.dailyData = response.data;
                vm.computeGraph(vm.dailyData);
            });
        },

        printDate: function(date) {
            date = moment(date);
            return date.calendar();
        },


        // "code-royale" -> "Code Royale"
        prettify: function(game) {
            return game
                .split("-")
                .map(word => word[0].toUpperCase() + word.substr(1))
                .join(" ");
        },

        computeGraph: function(data) {
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
            return baseUrl + game + "/";
        }

    }
};
</script>
