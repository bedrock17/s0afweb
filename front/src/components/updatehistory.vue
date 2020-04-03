<template>
  <div class="help">

		<b-button v-b-toggle="'collapse-2'" variant="outline-info">업데이트 히스토리</b-button>
		<b-collapse id="collapse-2">
			<div class="text-update-log">
				<h3>ver 20.4.3.1</h3>
	사용자가 블럭 종류 및 색을 설정 할 수 있는 모드 추가, 기능 확장중 현재 베타버전
				<h3>ver 20.3.15.1</h3>
	랭크페이지 점수별 색상 추가
        <h3>ver 20.3.14.1</h3>
				<pre>
	게임을 계속 다시 시작할 때 내부적으로
	게임이 두 개 이상 실행되는 버그 수정
				</pre>
        <h3>ver 20.3.13.2</h3>
				<pre>
	지우는 효과 BFS로 탐색 방법 변경
				</pre>
        <h3>ver 20.3.13.1</h3>
				<pre>
	URI처리 버그 수정
				</pre>
        <h3>ver 20.3.12.2</h3>
				<pre>
	mac, ios에서 동작 안되는 문제 재수정
	효과 비활성화 가능하도록 수정
				</pre>
        <h3>ver 20.3.12.1</h3>
				<pre>
	지워지는 효과 추가
	URI 처리 버그 수정
	히스토리 추가
	문의는 이곳으로
	:) https://open.kakao.com/o/g9F8Ym1b
				</pre>
			</div>
		</b-collapse>

  </div>
</template>

<style lang="scss" scoped>

button {
	margin-top: 10px;
	margin-right: 10px;
	margin-bottom: 20px;
}

.text-update-log {
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

</style>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component
export default class Help extends Vue {
}
</script>
