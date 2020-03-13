<template>
  <div class="home">
		<Help />
    <Poptile/>
		<UpdateHistory />
  </div>
</template>

<style lang="scss">



</style>

<script>
// @ is an alias to /src
import Poptile from '@/components/poptile.vue'
import Help from "@/components/help.vue"
import UpdateHistory from "@/components/updatehistory.vue"

// import image from "./assets/talalgo.png"

export default {
  name: 'Home',
  components: {
		Poptile,
		Help,
		UpdateHistory,
  }
}
</script>
