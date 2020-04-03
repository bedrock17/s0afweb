import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import PoptileClassic from '../views/PoptileClassic.vue'
import PoptileCustom from '../views/PoptileCustom.vue'

Vue.use(VueRouter)

const routes = [
	{
		path: '/static/index.html',
		name: 'Home',
		component: Home
	},
	{
		path: '/poptile/custom',
		name: 'poptileClassic',
		component: PoptileCustom
	},
	{
		path: '/poptile/classic',
		name: 'poptileClassic',
		component: PoptileClassic
	},
	{
		path: '/poptile',
		name: 'Home',
		component: Home
	},
	{
		path: '/',
		name: 'Home',
		component: Home
	},
	{
		path: '/static/poptile',
		name: 'Home',
	},
	{
		path: '/static/poptile/rank',
		name: 'RankPage',
		component: () => import(/* webpackChunkName: "about" */ '../views/RankPage.vue')
	},
	{
		path: '/poptile/rank',
		name: 'RankPage',
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: () => import(/* webpackChunkName: "about" */ '../views/RankPage.vue')
	}
]

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
})

export default router
