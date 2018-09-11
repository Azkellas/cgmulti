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
  },

  // --------------
  // SCOPED METHODS
  // --------------
  methods: {
    getData: function() {
        var vm = this;
        axios
        .get('/players/', {
            params: {
                playersQuery: this.playersQuery
            }
        })
        .then(function(response) {
            //console.log(response);
            vm.result = response.data;
            //console.log(vm.result)
        });
    }
  }
})