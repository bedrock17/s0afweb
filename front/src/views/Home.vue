<template>
  <div class="home">
		<Help />
    <Poptile/>
  </div>
</template>

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
