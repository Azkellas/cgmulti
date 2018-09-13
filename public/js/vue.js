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
                playersQuery: this.playersQuery
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
  }
  }
})