<template>
  <div class="home">
    <Poptile/>
  </div>
</template>

<style lang="scss">

</style>

<script>
// @ is an alias to /src
import Poptile from '@/components/poptile.vue'

// import image from "./assets/talalgo.png"

export default {
  name: 'Home',
  components: {
		Poptile,
  }
}
</script>
