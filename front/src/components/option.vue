<template>
  <div class="option">

  </div>
</template>

<style lang="scss" scoped>

</style>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component
export default class Help extends Vue {
  showHint = false;

  toggle() {
    this.showHint = !this.showHint;
  }
}
</script>
