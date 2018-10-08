<template>
    <div class="playerRoot">
        <br /><br />
        <form action="/players/" method="post" v-on:submit.prevent="getData">
            <input type="text" v-model="playersQuery" placeholder="player1 player2 player3" id="playersQuery" class="form-control">
            <input type="submit" style="visibility: hidden;" />
        </form>
        <!-- if a request has been made-->
        <span v-if="!_.isEmpty(result)">
            <!-- if some players were not found -->
            <span v-if="result.players_not_found.length">
                <span v-for="player of result.players_not_found" :key="player">
                    Player "{{player}}" could not be found <br />
                </span>
            </span>

            <!--  if the table is not empty-->
            <table v-if="result.players_found.length" class="table table-dark table-striped table-bordered table-hover table-condensed table-sm" style="width:auto;" align="center">
                <thead>
                    <tr>
                        <th scope="col"></th>
                        <th v-for="player of result.players_found" :key="player">{{player}}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(players, game) in result['games']" :key="game">
                        <!-- game -->
                        <th scope="row"><span class="game"><a :href='getLink(game)' target="_blank">{{prettify(game)}}</a></span></th>
                        <!-- displays players ranks-->
                        <td v-for="player of result.players_found" :class="tdClass(players[player])" :key="player">
                            <!-- player is rank in the given multi-->
                            <span v-if="players[player]">
                                <span :class="players[player]['league']" v-tooltip="printDate(players[player]['date'])">
                                    <!-- rank -->
                                    {{players[player]["rank"]}} 
                                    <!-- league-->
                                    <span v-if="players[player].league !== 'no_league'"> {{players[player]["league"]}}</span>
                                </span>
                            </span>
                            <!-- player is not rank in the given multi-->
                            <span v-else class="undefined"></span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </span>
    </div>
</template>

<style>
</style>

<script>
const baseUrl = 'https://www.codingame.com/multiplayer/bot-programming/';

module.exports = {
    data: function() {
        return {
            result: {},
            playersQuery: "",
            locale: window.navigator.userLanguage || window.navigator.language
        };
    },


    created: function() {
        this.initialData(this.$route);
        // get local date format while writing in english
        moment.locale(this.locale);
        var data = moment.localeData()._longDateFormat;
        moment.locale("en-US");
        moment.localeData()._longDateFormat = data;
    },

    watch: {
        // whenever question changes, this function will run
        '$route': function(newRoute, oldRoute) {
            this.initialData(newRoute);
        }
    },

    methods: {
        getData: function() {
            var vm = this;
            router.push({ path: '/players', query: {'p':vm.playersQuery} });

            axios
            .get("/playersQuery/", {
                params: {
                    playersQuery: this.playersQuery.replace(/[\ ]+/g, " ")
                }
            })
            .then(function(response) {
                vm.result = response.data;
            });
        },

        initialData: async function(route) {
            var vm = this;
            if (route.path !== "/players") {
                vm.result = {};
                return;
            }
            if (!route.query || !route.query.p)
            {
                vm.playersQuery = '';
                vm.result = {};
                return;
            }
            let players = route.query.p;
            players = players.replace(/%20/g, " ");

            if (players === "")
            {
                vm.result = {};
                return;
            }
            vm.playersQuery = players;
            axios
            .get("/playersQuery/", {
                params: {
                    playersQuery: players
                }
            })
            .then(function(response) {
                vm.result = response.data;
            });
        },

        printDate: function(date) {
            date = moment(date);
            return date.calendar();
        },

        tdClass: function(player) {
            if (this.result.players_found.length < 2)
                return "";
            if (player === undefined)
                return "";
            if (player.first !== "")
                return "first";
            return "";
        },

        // "code-royale" -> "Code Royale"
        prettify: function(game) {
            return game
            .split("-")
            .map(word => word[0].toUpperCase() + word.substr(1))
            .join(" ");
        },

        getLink: function(game) {
            return baseUrl + game + "/";
        }
    }
};
</script>

