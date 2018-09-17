<template>
    <line-chart :data="dailyData" :messages="{empty: 'Failed to load data. Try again or contact Azkelas.'}"></line-chart>
</template>

<style>
</style>

<script>
const baseUrl = 'https://www.codingame.com/multiplayer/bot-programming/';

module.exports = {
  //VueChartJs.Line,
  data: function() {
    return {
      // result: {'players_found':['Azke'],'players_not_found':[], 'games':{'coc':{'Azke':{'rank':'1','first':'','league':'Legend'}}}},
      options: {},
      dailyData: {},
      locale: window.navigator.userLanguage || window.navigator.language
    };
  },

  // ------------
  // DERIVED DATA
  // ------------
  computed: {},
  // ---------------
  // LIFECYCLE HOOKS
  // ---------------
  mounted: function() {
    // this.$router.push('/players')
    this.getDailyStats();

    // get local date format while writing in english
    moment.locale(this.locale);
    var data = moment.localeData()._longDateFormat;
    moment.locale("en-US");
    moment.localeData()._longDateFormat = data;
},

  watch: function() {
  },


  // --------------
  // SCOPED METHODS
  // --------------
  methods: {
    getDailyStats: function() {
      var vm = this;

      axios
        .get("/statisticsQuery/", {}).then(function(response) {
          vm.dailyData = response.data;
          console.log("get");
          console.log(vm.dailyData);
          vm.options = {};
          vm.options.type = 'line';
          vm.options.data = vm.dailyData;
          vm.options.options = {};
          console.log(vm.options);

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


