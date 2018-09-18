<template>
    <line-chart id="dailyChart" :data="dailyData" height="700px" :messages="{empty: 'Failed to load data. Try again or contact Azkellas.'}"></line-chart>
</template>

<style>
</style>

<script>
const baseUrl = 'https://www.codingame.com/multiplayer/bot-programming/';

module.exports = {
    data: function() {
        return {
            options: {},
            dailyData: {},
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
                vm.options = {};
                vm.options.type = 'line';
                vm.options.data = vm.dailyData;
                vm.options.options = {};
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

    }
};
</script>
