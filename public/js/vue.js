new Vue({
	// -------------
	// APP CONTAINER
  // -------------
  el: '#app',
  // --------
  // RAW DATA
  // --------
  data: {
    result: {},
    playersQuery: '',
    route: window.location,
    locale: window.navigator.userLanguage || window.navigator.language
  },
  
    // ------------
    // DERIVED DATA
    // ------------
  computed: {
  },
  
  // ---------------
  // LIFECYCLE HOOKS
  // ---------------
  created: function () {
    this.initialData(this.route);

    // get local date format while writing in english
    moment.locale(this.locale);
    var data = moment.localeData()._longDateFormat;
    moment.locale('en-US');
    moment.localeData()._longDateFormat = data;
  },

  // --------------
  // SCOPED METHODS
  // --------------
  methods: {
    getData: function() {
        var vm = this;
        window.history.replaceState('players', 'CG multi', '/players'+'?'+this.playersQuery)
        axios
        .get('/playersQuery/', {
            params: {
                playersQuery: this.playersQuery.replace(/[\ ]+/g," ")
            }
        })
        .then(function(response) {
            vm.result = response.data;
        });
    },

    initialData: async function(route) {
      var vm = this;
      if (route.pathname !== '/players')
      {
        vm.result = {};
        return;
      }
      players = route.search.substr(1);
      players = players.replace(/%20/g," ");
      vm.playersQuery = players;
      axios
      .get('/playersQuery/', {
          params: {
              playersQuery: players
          }
      })
      .then(function(response) {
          vm.result = response.data;
      });
    },

    printDate: function(date)
    {
        date = moment(date);
        return date.calendar();
        return date.format('L');
    },

    tdClass: function(player)
    {
        if (player === undefined)
            return '';
        if (player.first !== '')
            return 'first';
        else
            return '';
    }
  }
})