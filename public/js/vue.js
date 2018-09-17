const Players = httpVueLoader('js/templates/players.vue');
const Statistics = httpVueLoader('js/templates/statistics.vue');

const router = new VueRouter({
    mode: 'history',
    routes: [
        {path: '/players',    component: Players},
        {path: '/statistics', component: Statistics}
    ]
});

const app = new Vue({
    el: '#app',
    router,

    methods: {
        isActiveTab: function(path) {
            console.log(this.$route);
            console.log("$rouge:" + this.$route.path);
            console.log("path:" + path);
            console.log(this.$route.path === path);
            if (this.$route.path === path)
                return 'active';
            else
                return '';
        }
    }
});