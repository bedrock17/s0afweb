<template>
  <div class="RankPage">
    <Rank />
  </div>
</template>

<script>
// @ is an alias to /src
import Rank from '@/components/Rank.vue'

export default {
  name: 'Home',
  components: {
		Rank
  }
}
</script>
