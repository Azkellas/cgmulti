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
    router
});