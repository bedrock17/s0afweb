<template>
  <div class="home">

		<router-link to="/poptile/classic" class="btn btn-outline-info"> POPTILE Classic </router-link> &nbsp;
		<router-link to="/poptile/custom" class="btn btn-outline-info"> POPTILE Custom </router-link>
		
    
		<UpdateHistory />
  </div>
</template>

<style lang="scss">

.home {
  margin-top: 10px;
}


</style>

<script>
// @ is an alias to /src


import UpdateHistory from "@/components/updatehistory.vue"

// import image from "./assets/talalgo.png"

export default {
  name: 'Home',
  components: {


		UpdateHistory,
  }
}
</script>
