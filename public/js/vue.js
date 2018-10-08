const Players = httpVueLoader('js/templates/players.vue');
const Statistics = httpVueLoader('js/templates/statistics.vue');

const router = new VueRouter({
    mode: 'history',
    routes: [
        {path: '/players',    component: Players},
        {path: '/statistics', component: Statistics, props: {frequency: 'weekly'}}
    ]
});

const app = new Vue({
    el: '#app',
    router,

    methods: {
        isActiveTab: function(path) {
            if (this.$route.path.indexOf(path) !== -1)
                return 'active';
            else
                return '';
        },
    },

});


