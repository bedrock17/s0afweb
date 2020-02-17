<template>
  <div class="help">
    <div v-on:click="toggle">
      <h1 v-bind:class="{active: showHint}">사용법</h1>
    </div>

    <transition name="bounce">
      <div v-if="showHint" class="help-text">
        <p>1. 타일이 최대 높이를 넘으면 게임이 종료됩니다.</p>
        <p>
          2. 타일을 선택하면 선택된 타일과 인접한 같은 색의 타일이 지워지고 타일이
          아래에서 올라옵니다.
        </p>
        <p>3. 이름을 입력하면 이름으로 점수가 등록됩니다.</p>
      </div>
    </transition>
  </div>
</template>

<style lang="scss" scoped>

.active {
	color: #0af;
}

.help-text {
  text-align: left;
  word-break: keep-all;
  width: 500px;
  margin: auto;

	p {
		margin: 0px;
		padding-bottom: 10px;
	}
}


.bounce-enter-active {
  animation: bounce-in 2s;
}
.bounce-leave-active {
  animation: bounce-in 0s reverse;
}

@keyframes bounce-in {
  0% {
    overflow: hidden;
    max-height: 0;
    transition: max-height 0.3s ease-out; // note that we're transitioning max-height, not height!
  }
  100% {
    overflow: hidden;
    height: auto;
    max-height: 600px; // still have to hard-code a value!
    transition: max-height 0.3s ease-out; // note that we're transitioning max-height, not height!
  }
}
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
