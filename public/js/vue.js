const app = new Vue({
    el: '#app',
    // -------------
	// APP CONTAINER
  // -------------
  // router,
  // --------
  components: {
      'players': httpVueLoader('js/templates/players.vue')
  },
  // RAW DATA
  // --------
})