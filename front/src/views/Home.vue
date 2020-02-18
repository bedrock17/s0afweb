<template>
  <div class="home">
		<Help />
    <Poptile/>

    <div id="nav">
      <router-link to="/rank">RANK</router-link>
    </div>

  </div>
</template>

<style lang="scss">

* {
	-webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

</style>

<script>
// @ is an alias to /src
import Poptile from '@/components/poptile.vue'
import Help from "@/components/help.vue"

export default {
  name: 'Home',
  components: {
		Poptile,
		Help
  }
}
</script>
