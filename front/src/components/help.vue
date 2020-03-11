<template>
  <div class="help">

		<b-button v-b-toggle="'collapse-1'" variant="outline-info">사용법</b-button>

		<!-- Element to collapse -->
		<b-collapse id="collapse-1">
			<div class="help-text">
        <p>1. 타일이 최대 높이를 넘으면 게임이 종료됩니다.</p>
        <p>
          2. 타일을 선택하면 선택된 타일과 인접한 같은 색의 타일이 지워지고 타일이
          아래에서 올라옵니다.
        </p>
        <p>3. 이름을 입력하면 이름으로 점수가 등록됩니다.</p>
      </div>
		</b-collapse>
		<br>

  </div>
</template>

<style lang="scss" scoped>

button {
	margin-top: 10px;
	margin-right: 10px;
	margin-bottom: 20px;
}

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

@media (max-width: 500px) {
  .help-text {
    
    width: 100%;

  }
}


.bounce-enter-active {
  animation: bounce-in 2s;
}
.bounce-leave-active {
  animation: bounce-in 0s reverse;
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
