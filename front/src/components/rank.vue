<template>
  <div class="Rank">
    <div v-if="RankList.length > 0">
      <h1> RANK </h1>
      <div>
        <p v-for="item in RankList" v-bind:key="item.UserName"> {{item.UserName}} : {{item.Score}} </p>
      </div>

      <div id="nav">
        <router-link to="/">GAME</router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator"
import axios from 'axios'

@Component
export default class Rank extends Vue {
  
  RankList = []

  mounted() {
    this.RankList = []
    console.log("??")
    axios.get('/api/poptilerank').then((res: any) => {
        this.RankList = res.data.RankList
      })
  }
}
</script>