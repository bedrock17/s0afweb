<template>
  <div class="RankPage">
    <Rank v-bind:RankList="pageRankList"/>
		<div id="nav">
        <router-link to="/" class="btn btn-outline-info">GAME</router-link>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Rank from '@/components/Rank.vue'
import axios from 'axios'

export default {
  name: 'Home',
  components: {
		Rank
  },

	data: ()=>{
		return {
			pageRankList: []
		}
	},

	mounted() {
		axios.get('/api/poptilerank').then((res) => {
			this.pageRankList = res.data.RankList
		})
	}
}
</script>
